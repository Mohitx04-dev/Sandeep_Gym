import React from 'react';
import {Pagination, Button} from 'react-bootstrap';

//Argumet 1 pages which is Total number of pages possible
//Argument 2 currentpage which is selected page right now

//Three Functions
//Hundread Change (when +100 or -100 is clicked)
//Ten Change (When +10 or -10 is clicked)
//nextPage (when from options any page is selected)

const PaginationPage = (props) => {
    const pageLinks = [];
    const {currentPage,pages} = props;
    //Start will point to strating page which is multiple of 10 for current page
    //If currentpage is 18 than it will show 10 to 10+11 pages as link to move
    let start=(currentPage)-(currentPage%10);
    if(start<=0)
        start=1;
    for (let i = start; i <= start+11 && i <= pages; i++) {
        pageLinks.push(
            <Pagination.Item active={currentPage === i}>
                <Button onClick={() => props.nextPage(i)}>
                    {i}
                </Button>
            </Pagination.Item>
        )
    }

    return (
        <Pagination aria-label="Page navigation example" className="paginationcss">
            {
                currentPage > 100 &&
                <Pagination.Item >
                    <Button className="addbuttons" onClick={() => props.hundreadChange(currentPage,-1)}>
                        - 100
                    </Button>
                </Pagination.Item>
            }
            {
                currentPage > 10 &&
                <Pagination.Item>
                    <Button className="addbuttons" onClick={() => props.tenChange(currentPage,-1)} >
                        - 10
                    </Button>
                </Pagination.Item>
            }
            {pageLinks}
            {
                (currentPage + 10) < pages &&
                <Pagination.Item>
                    <Button className="addbuttons" onClick={() => props.tenChange(currentPage,1)} >
                        + 10
                    </Button>
                </Pagination.Item>
            }
             {
                (currentPage + 100) < pages &&
                <Pagination.Item>
                    <Button className="addbuttons" onClick={() => props.hundreadChange(currentPage,1)} >
                        + 100
                    </Button>
                </Pagination.Item>
            }
        </Pagination>
    )
}
export default PaginationPage;