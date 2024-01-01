document.addEventListener("DOMContentLoaded", function () {
  function openPopup(event) {
    const popupForm = document.getElementById("popupForm");
    const submenuDisplay = document.getElementById("submenuDisplay");

    const submenuData = JSON.parse(
      event.currentTarget.getAttribute("data-order")
    );

    // Display the submenu information in the form
    submenuDisplay.innerHTML = "";
    submenuDisplay.innerHTML += `
    <div class='flex h-full items-center justify-center'>
        <div class="flex items-center justify-center ">
            <div class="overflow-x-auto relative shadow-md sm:rounded-lg">
                <div class="overflow-x-auto relative shadow-md sm:rounded-lg">
                <table class="w-full text-sm text-left text-gray-500 ">
                
                    <tbody>
                    <tr class="bg-white border-b  ">
                        <td class="py-4 px-6 font-bold">Item Id</td>
                        <td class="py-4 px-6">${submenuData.id}</td>
                       
                    </tr>
                    <tr class="bg-white border-b  ">
                        <td class="py-4 px-6 font-bold">Customer Id(from stripe)</td>
                        <td class="py-4 px-6">${submenuData.customer}</td>
                        
                    </tr>
                    <tr class="bg-white border-b  ">
                        <td class="py-4 px-6 font-bold">Payment Method ID</td>
                        <td class="py-4 px-6">${submenuData.payment_method}</td>
                       
                    </tr>
                    <tr class="bg-white border-b  ">
                        <td class="py-4 px-6 font-bold">Is Paid</td>
                        <td class="py-4 px-6">${submenuData.paid}</td>
                       
                    </tr>
                    <tr class="bg-white ">
                        <td class="py-4 px-6 font-bold">Payment Intent</td>
                        <td class="py-4 px-6">${submenuData.payment_intent}</td>
                        
                    </tr>
                    <tr class="bg-white ">
                    <td class="py-4 px-6 font-bold">Balance Transaction</td>
                    <td class="py-4 px-6">${submenuData.balance_transaction}</td>
                    
                    </tr>
                    <tr class="bg-white ">
                    <td class="py-4 px-6  font-bold">Customer Email</td>
                    <td class="py-4 px-6">${submenuData.billing_details.email}</td>
                
                    </tr>
                    <tr class="bg-white ">
                    <td class="py-4 px-6  font-bold">Address</td>
                    <td class="py-4 px-6">${submenuData.billing_details.address.city},${submenuData.billing_details.address.line1},${submenuData.billing_details.address.line2}</td>
            
                    </tr>
                    <tr class="bg-white ">
                    <td class="py-4 px-6  font-bold">Postal Code</td>
                    <td class="py-4 px-6">${submenuData.billing_details.address.postal_code}</td>
        
                    </tr>
                    <tr class="bg-white ">
                    <td class="py-4 px-6  font-bold">Country</td>
                    <td class="py-4 px-6">${submenuData.billing_details.address.country}</td>
    
                    </tr>
                    <tr class="bg-white ">
                    <td class="py-4 px-6  font-bold">Risk Level</td>
                    <td class="py-4 px-6">${submenuData.outcome.risk_level}</td>

                    </tr>
                    <tr class="bg-white ">
                    <td class="py-4 px-6  font-bold">Risk Score</td>
                    <td class="py-4 px-6">${submenuData.outcome.risk_score}</td>

                    </tr>
                    <tr class="bg-white ">
                    <td class="py-4 px-6  font-bold">Item ID</td>
                    <td class="py-4 px-6">${submenuData.id}</td>

                    </tr>
                    <tr class="bg-white ">
                    <td class="py-4 px-6  font-bold">Card Brand:</td>
                    <td class="py-4 px-6">${submenuData.payment_method_details.card.brand}</td>

                    </tr>
                    <tr class="bg-white ">
                    <td class="py-4 px-6  font-bold">Card</td>
                    <td class="py-4 px-6">**** **** **** ${submenuData.payment_method_details.card.last4}</td>

                    </tr>
                   
                    </tbody>
                </table>
                </div>
        </div>
        
    </div>
    </div>
    `;

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
