const API = "https://api.github.com/users/";
const main = document.getElementById("main");
const form = document.getElementById("form");
const search = document.getElementById("search");

const getUser = async (username) => {
  try {
    const { data } = await axios(API + username);
    createUser(data);
    getRepos(username);
  } catch (err) {
    if (err.response.status == 404) {
      main.innerHTML = 
      `
        <div class="card">
            <h1 class='error'>No profile with this username</h1>
        </div>
      `;
    }
  }
};

const getRepos = async (username) => {
  try {
    const { data } = await axios(API + username + "/repos?sort=created");
    addReposToCard(data);

  } catch (err) {
    main.innerHTML = 
    `
      <div class="card">
          <h1>Problem fetching repos</h1>
      </div>
    `;
  }
};

function createUser(user) {
  const userID = user.name || user.login;
  const userBio = user.bio ? `<p class='user-description'>${user.bio}</p>` : "";
  main.innerHTML = 
  `
    <div class="card">
      <div>
        <img src="${user.avatar_url}" alt="${user.name}" class="avatar">
      </div>
      <div class="user-info">
        <h2>${userID}</h2>
        ${userBio}
        <ul>
          <li>${user.followers} <strong>Followers</strong></li>
          <li>${user.following} <strong>Following</strong></li>
          <li>${user.public_repos} <strong>Repos</strong></li>
        </ul>
        <div id="repos"></div>
      </div>
    </div>
  `;
}

const createError = (msg) => {
  main.innerHTML = 
  `
    <div class="card">
        <h1 class='error'>${msg}</h1>
    </div>
  `;
};

const addReposToCard = (repos) => {
  const reposEl = document.getElementById("repos");

  repos.slice(0, 4).forEach((repo) => {
    const repoElem = document.createElement("a");
    repoElem.classList.add("repo");
    repoElem.href = repo.html_url;
    repoElem.target = "_blank";
    repoElem.innerText = repo.name;

    reposEl.appendChild(repoElem);
  });
};

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const user = search.value;
  if (user) {
    getUser(user);

    search.value = "";
  }
});
