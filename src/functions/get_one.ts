const getOne = () => {
    const google: Window = window.open('https://google.com');
    google.addEventListener<'load'>(
        'load',
        () => {
            console.log('google charged');
        },
        true,
    );
};

export default getOne;
