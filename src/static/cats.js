const categories = [
  { id: 1, name: "Opinion" },
  { id: 2, name: "Science" },
  { id: 3, name: "Technology" },
  { id: 4, name: "Politics" },
  { id: 5, name: "Craft" },
  { id: 6, name: "Food" },
];

const posts = [];
// Generate articles for each category
categories.forEach((category) => {
  for (let i = 0; i < 2; i++) {
    const post = {
      id: posts.length + 1,
      title: `Article ${posts.length + 1} about ${category.name}`,
      desc: `Description of Article ${posts.length + 1} in the ${
        category.name
      } category. Description of Article ${posts.length + 1} in the ${
        category.name
      } category.Description of Article ${posts.length + 1} in the ${
        category.name
      } category.Description of Article ${posts.length + 1} in the ${
        category.name
      } category.`,
      image: "https://source.unsplash.com/random/?tech",
      content: `<p>Content of Article ${posts.length + 1} in the ${
        category.name
      } category.</p>
      <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec mattis pretium massa. Aliquam erat volutpat. Nulla facilisi.
  Donec vulputate interdum sollicitudin. Nunc lacinia auctor quam sed pellentesque. Aliquam dui mauris, mattis quis lacus id,
  pellentesque lobortis odio.</p>
  <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec mattis pretium massa. Aliquam erat volutpat. Nulla facilisi.
  Donec vulputate interdum sollicitudin. Nunc lacinia auctor quam sed pellentesque. Aliquam dui mauris, mattis quis lacus id,
  pellentesque lobortis odio.</p>
  <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec mattis pretium massa. Aliquam erat volutpat. Nulla facilisi.
  Donec vulputate interdum sollicitudin. Nunc lacinia auctor quam sed pellentesque. Aliquam dui mauris, mattis quis lacus id,
  pellentesque lobortis odio.</p>`,
      author: "John Doe",
      category: category.name,
      createdAt: "2021-10-14",
    };
    posts.push(post);
  }
});

const mainPost = {
  title: "Hello, this is a title.",
  description:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec mattis pretium massa. Aliquam erat volutpat.",
  image:
    "https://images.unsplash.com/photo-1448375240586-882707db888b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80",
  imgText: "main image description",
  linkText: "Continue reading…",
  author: "John Doe",
  createdAt: "2021-10-14",
  category: "opinion",
  content: `<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec mattis pretium massa. Aliquam erat volutpat. Nulla facilisi.
  Donec vulputate interdum sollicitudin. Nunc lacinia auctor quam sed pellentesque. Aliquam dui mauris, mattis quis lacus id,
  pellentesque lobortis odio.</p>
  <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec mattis pretium massa. Aliquam erat volutpat. Nulla facilisi.
  Donec vulputate interdum sollicitudin. Nunc lacinia auctor quam sed pellentesque. Aliquam dui mauris, mattis quis lacus id,
  pellentesque lobortis odio.</p>
  <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec mattis pretium massa. Aliquam erat volutpat. Nulla facilisi.
  Donec vulputate interdum sollicitudin. Nunc lacinia auctor quam sed pellentesque. Aliquam dui mauris, mattis quis lacus id,
  pellentesque lobortis odio.</p>`,
};

export { categories, posts, mainPost };
