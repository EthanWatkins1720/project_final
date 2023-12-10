let toggle = false;
let toggle1 = false;

const displayMenu = () => {
  if (toggle == true) {
    document.getElementById("main-nav").style.display = "none";
    toggle = false;
  } else if (toggle == false) {
    document.getElementById("main-nav").style.display = "grid";
    toggle = true;
  }
}

const addShowHide = () => {
  if (toggle1) {
      document.getElementById("news-form").style.display = "none";
      toggle1 = false;
  } else if (toggle1 == false) {
      document.getElementById("news-form").style.display = "block";
      toggle1 = true;
  }
};

const addArticle = async (e) => {
  e.preventDefault();

  const form = document.getElementById("add-news");
  const formData = new FormData(form);
  
  let response;
  
  // For new articles
  if (form._id.value == -1) {
    formData.delete("_id");
    // console.log(...formData);
    response = await fetch("/api/data", {
      method: "POST",
      body: formData
    });
  } 
  else {
    // Existing article
    response = await fetch(`/api/data/${form._id.value}`, {
      method: "PUT",
      body: formData
    });
  }

  // Error
  if(response.status != 200) {
    // console.log(response);
    return;
  }

  response = await response.json();


  if (form._id.value != -1) {

  }
  addShowHide();
  resetForm();
  showArticles();
};

const resetForm = () => { 
  const form = document.getElementById("add-news");
  form.reset();
  form._id = "-1";
};

const showArticles = async() => {
  let response;
  let articleJSON;

  try {
    response = await fetch("/api/data");
    articleJSON = await response.json();  
  } catch (error) {
    console.log("Error retrieving JSON")
  }

  articleJSON.forEach((article) => {
    let section = document.createElement("section");
    
    let h2 = document.createElement("h2");
    section.append(h2);
    h2.innerHTML = article.title;

    let author = document.createElement("p");
    section.append(author);
    author.innerHTML = article.author;

    let date = document.createElement("p");
    section.append(date);
    date.innerHTML = article.date;

    let img = document.createElement("img");
    img.classList.add("image");
    section.append(img);
    img.src= article.image;

    let text = document.createElement("p");
    section.append(text);
    text.innerHTML = article.text;

    let buttonDiv = document.createElement("div");
    section.append(buttonDiv);

    let editButton = document.createElement("a");
    editButton.href = "#";
    editButton.innerHTML = "&#9998";
    editButton.classList.add("edit-button");
    buttonDiv.append(editButton);

    let deleteButton = document.createElement("a");
    deleteButton.href = "#";
    deleteButton.innerHTML = "X";
    deleteButton.classList.add("delete-button");
    buttonDiv.append(deleteButton);

    let realDeleteButtonDiv = document.createElement("div");
    realDeleteButtonDiv.classList.add("real-delete-button-div");
    section.append(realDeleteButtonDiv);

    editButton.onclick = (e) => {
      e.preventDefault();
      document.getElementById("news-form").style.display = "block";
      document.getElementById("add-article-title").innerHTML = "Edit Article";
      populateEditForm(article);
    }

    deleteButton.onclick = (e) => {
      e.preventDefault();
      deleteCheck(article);
    }
  });
};

const deleteCheck = (article) => {
  document.getElementById("real-delete-button-div").style.display = "block";
  document.getElementById("real-delete-button").onclick = (e) => {
      e.preventDefault();
      deleteArticle(article);
  }
  document.getElementById("cancel-button").onclick = (e) => {
      e.preventDefault();
      document.getElementById("real-delete-button-div").style.display = "none";
  }
};

const deleteArticle = async (article) => {
  let response = await fetch(`/api/data/${article._id}`, {
    method: "DELETE", 
    headers: {
      "Content-Type":"application/json;charset=utf-8",
    }
  });

  if (response.status != 200) {
    console.log("Error deleting");
    return;
  }

  let result = await response.json();
  document.getElementById("real-delete-button-div").style.display = "none";
  showArticles();
  resetForm();
}

const populateEditForm = (article) => {
  const form = document.getElementById("add-news");
  form._id.value = article._id;
  form.title.value = article.title;
  form.author.value = article.author;
  form.date.value = article.date;
  form.text.value = article.text;
}

window.onload = () => {
  toggle = false;
  toggle1 = false;
  showArticles();
  document.getElementById("burger").onclick = displayMenu;
  document.getElementById("add-button").onclick = addShowHide;
  document.getElementById("add-news").onsubmit = addArticle;
}

// window.location.href = __dirname +"/newsSubmit";