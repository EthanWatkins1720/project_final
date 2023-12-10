let toggle = false;

const displayMenu = () => {
  if (toggle == true) {
    document.getElementById("main-nav").style.display = "none";
    toggle = false;
  } else if (toggle == false) {
    document.getElementById("main-nav").style.display = "grid";
    toggle = true;
  }
}

const showEmailResult = async (e) => {
    e.preventDefault();
    const result = document.getElementById("result");
    let response = await getEmailResult();
    if (response.status == 200) {
      result.innerHTML = "Email Successfully Sent";
    } else {
      result.innerHTML = "Sorry, your email was not sent.";
    }
};

const getEmailResult = async (e) => {
    const form = document.getElementById("contact-form");
    const formData = new FormData(form);
    const object = Object.fromEntries(formData);
    const json = JSON.stringify(object);
    const result = document.getElementById("result");
    result.innerHTML = "Please wait...";
  
    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: json,
      });
      return response;
    } catch (error) {
      console.log(error);
      document.getElementById("result").innerHTML =
        "Sorry your email couldn't be sent";
    }
};

const showExamplePost = () => {
    // alert("hi");
    const title = document.getElementById("postEX-h2");
    title.innerHTML = document.getElementById("title-text").value;
    const body = document.getElementById("post-text");
    body.innerHTML = document.getElementById("body-text").value;
    document.getElementById("success-message").style.display = "block";
    document.getElementById("postEX").style.display = "block";
}

const getForumPosts = async() => {
  const url = "https://ethanwatkins.github.io/projects/Part4/forumPosts.json";

  try {
    const response = await fetch(url);
    return await response.json();
  } catch(error) {
    console.log(error);
  }
}

const getUsers = async() => {
  const location = "https://github.com/EthanWatkins1720/jsonStorage/blob/main/forumPosts.json";

  try {
    const response = await fetch(location);
    return await response.json();
  } catch(error) {
    console.log(error);
  }
}

const showForumPosts = async() => {
  let posts = await getForumPosts();
  let postsSection = document.getElementById("posts-section");

  posts.forEach((post) => 
    postsSection.append(getPostItem(post))
  );
}

const getPostItem = (post) => {
  let postSection = document.createElement("div");
  postSection.setAttribute('class','forum-preview');


  return postSection;
}

window.onload = () => {
  toggle = false;
  document.getElementById("burger").onclick = displayMenu;
  const checkContact = document.querySelector("#contact");
  if (checkContact) {
    document.getElementById("submit-button").onclick = showEmailResult;
  }
  const checkForumSubmit = document.querySelector("#postEX");
  if (checkForumSubmit) {
    document.getElementById("form-submit-button").onclick = showExamplePost;
  } 
  const checkPostsSection = document.querySelector("#posts-section");
  if (checkPostsSection) {
    showForumPosts();
  }
}