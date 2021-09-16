import React from 'react'

const toLowerCase = e => {
    e.target.value = ("" + e.target.value).toLowerCase();
};

export default toLowerCase
