document.addEventListener("DOMContentLoaded", function () {
  function openPopup(event) {
    const popupForm = document.getElementById("popupForm");
    const menuIdField = document.getElementById("menuIdField");
    const submenuDisplay = document.getElementById("submenuDisplay");

    const menuId = event.currentTarget.getAttribute("data-menu-id");
    const submenuData = JSON.parse(
      event.currentTarget.getAttribute("data-submenu")
    );
    const token = event.currentTarget.getAttribute("data-token");

    menuIdField.value = menuId;

    // Display the submenu information in the form
    submenuDisplay.innerHTML = "";
    submenuData.forEach((submenu) => {
      submenuDisplay.innerHTML += `<div class="flex flex-col">${submenu.title}: $ ${submenu.price}
      <form  action="/api/v1/menu/create/addons" method="post">
      <input type="text" name="x-csrf-token" value="${token}" hidden />
      <input type="hidden" name="id" id="menuIdField" value="${menuId}" />
      <input type="hidden" name="ids" id="subId" value="${submenu.id}" />
      <div class="flex flex-row justify-evenly"/>
      <input
      type="text"
      name="title"
      placeholder="Title"
      class="block w-full px-5 py-3 m-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-md  focus:border-green-400 focus:ring-green-400 focus:outline-none focus:ring focus:ring-opacity-40"
    />
    <input
      type="text"
      name="price"
      placeholder="Price"
      class="block w-full px-5 py-3 m-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-md  focus:border-green-400 focus:ring-green-400 focus:outline-none focus:ring focus:ring-opacity-40"
    />
    </div>
    <button
    type="submit"
    class="flex items-center justify-center h-10 mt-4 m-2 w-36 px-6 py-3 text-sm tracking-wide text-white capitalize transition-colors duration-300 transform bg-green-500 rounded-md hover:bg-green-400 focus:outline-none focus:ring focus:ring-green-300 focus:ring-opacity-50"
  >
    <span>Add</span>
  </button>
    </form>
    </div>`;
    });

    popupForm.style.display = "block";
    popupForm.style.zIndex = "100";
  }

  function closePopup() {
    document.getElementById("popupForm").style.display = "none";
  }

  const openPopupButtons = document.querySelectorAll(".openPopupButton");
  openPopupButtons.forEach((button) => {
    button.addEventListener("click", (event) => openPopup(event));
  });

  document.getElementById("closePopup").addEventListener("click", closePopup);
});
