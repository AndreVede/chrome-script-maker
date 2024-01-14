const getOne = () => {
    const google = window.open('https://google.com');
    google.addEventListener('load', () => {}, true);
};

const getTwo = () => {
    const wiki = window.open(
        'https://fr.wikipedia.org/wiki/Wikip%C3%A9dia:Accueil_principal',
    );
    wiki.addEventListener('load', () => {}, true);
};

const doIt = () => {
    getOne();
    getTwo();
};

doIt();
