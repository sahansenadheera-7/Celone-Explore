const destinations = [
    {
        id: 1,
        title: "Sigiriya",
        category: "Historical",
        imageUrl: "https://www.biofin.org/sites/default/files/content/news_media/Screenshot%202564-08-02%20at%2010.14.55.png"
    },
    {
        id: 2,
        title: "Ella",
        category: "Nature",
        imageUrl: "https://i0.wp.com/beyondwildplaces.com/wp-content/uploads/2024/02/Things-to-do-in-Ella.jpg?resize=1170%2C600&ssl=1"
    },
    {
        id: 3,
        title: "Galle Fort",
        category: "Historical",
        imageUrl: "https://do6raq9h04ex.cloudfront.net/sites/8/2021/07/galle-fort-1050x700-1.jpg"
    },
    {
        id: 4,
        title: "Mirissa",
        category: "Beach",
        imageUrl: "https://media.timeout.com/images/106252539/1920/1080/image.webp"
    }
];

export const getTopDestinations = async (limit = 4) => {
    return destinations.slice(0, limit);
};