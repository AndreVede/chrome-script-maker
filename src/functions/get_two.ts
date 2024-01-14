export default () => {
    const wiki = window.open(
        'https://fr.wikipedia.org/wiki/Wikip%C3%A9dia:Accueil_principal',
    );
    wiki.addEventListener('load', () => {}, true);
};
