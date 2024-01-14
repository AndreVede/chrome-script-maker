const getOne = () => {
    const google = window.open('https://google.com');
    google.addEventListener('load', () => {}, true);
};

export default getOne;

getOne();
