import React from 'react'

const toInputUppercase = e => {
    e.target.value = ("" + e.target.value).toUpperCase();
};

export default toInputUppercase
