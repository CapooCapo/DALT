function myFunction() {
  document.getElementById("myDropdown").classList.toggle("show");
}

window.onclick = function(event) {
  if (!event.target.matches('.dropbtn')) {
      var dropdowns = document.getElementsByClassName("dropdown-content");
      var i;
      for (i = 0; i < dropdowns.length; i++) {
          var openDropdown = dropdowns[i];
          if (openDropdown.classList.contains('show')) {
              openDropdown.classList.remove('show');
          }
      }
  }
}

function updateTotal() {
  var pricePerItem = 12000; // Giá mỗi sản phẩm
  var quantity = document.getElementById("quantity").value;
  var totalPrice = pricePerItem * quantity;
  document.getElementById("total-price").innerText = totalPrice.toLocaleString('vi-VN') + ' VND';
}

async function handlePayment(url) {
  const totalPriceText = document.getElementById('total-price').innerText;
  const amount = parseInt(totalPriceText.replace(/\D/g, ''));

  try {
      const response = await fetch(url, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({ amount })
      });

      const data = await response.json();
      console.log("Response data:", data);
      if (data.zp_trans_token) {
          window.location.href = data.order_url;
      } else if (data.payUrl) {
          window.location.href = data.payUrl;
      } else {
          alert('Payment initiation failed');
      }
  } catch (error) {
  }
}

document.getElementById("quantity").addEventListener("change", updateTotal);
document.getElementById("zalopay-button").addEventListener("click", () => handlePayment('/payment'));
document.getElementById("momo-button").addEventListener("click", () => handlePayment('/payment_momo'));


updateTotal();
document.addEventListener('DOMContentLoaded', function () {
  const quantityInput = document.getElementById('quantity');
  const payWithZaloPayButton = document.getElementById('zalopay-button');

  if (quantityInput) {
      quantityInput.addEventListener('input', updateTotal);
  }

  if (payWithZaloPayButton) {
      payWithZaloPayButton.addEventListener('click', handlePayment);
  }

});
document.addEventListener('DOMContentLoaded', function () {
  const quantityInput = document.getElementById('quantity');
  const payWithMoMoButton = document.getElementById('momo-button');

  if (quantityInput) {
      quantityInput.addEventListener('input', updateTotal);
  }

  if (payWithMoMoButton) {
      payWithMoMoButton.addEventListener('click', handlePayment);
  }});