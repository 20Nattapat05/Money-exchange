const API_KEY = "0477a594b31fe83e181c8f05";
const API_URL = "https://v6.exchangerate-api.com/v6";

const amountInput = document.getElementById("amount");
const fromCurrencySelect = document.getElementById("fromCurrency");
const toCurrenciesSelect = document.getElementById("toCurrencies");
const resultContainer = document.getElementById("resultContainer");
const submitBtn = document.getElementById("submitBtn");

function loadCurrencies() {
  fetch(`${API_URL}/${API_KEY}/codes`)
    .then(res => res.json())
    .then(data => {
      const currencies = data.supported_codes;

      fromCurrencySelect.innerHTML = '';
      toCurrenciesSelect.innerHTML = '';

      const placeholderOption = new Option("กรุณาเลือกสกุลเงิน", "", true, true);
      fromCurrencySelect.add(placeholderOption);

      currencies.forEach(([code, name]) => {
        const option = new Option(`${code} - ${name}`, code);
        fromCurrencySelect.add(option);
        toCurrenciesSelect.add(option.cloneNode(true));
      });

      new TomSelect("#fromCurrency", {
        placeholder: "กรุณาเลือกสกุลเงิน",
        allowEmptyOption: true,
        maxItems: 1,
        persist: false,
        searchField: ["text"],
        render: {
          option: function (data, escape) {
            return `<div>
              <img src="https://flagcdn.com/24x18/${data.value.slice(0, 2).toLowerCase()}.png" 
                   onerror="this.style.display='none'" 
                   alt="flag" class="me-2" 
                   style="width: 24px; height: 18px; vertical-align: middle;" />
              ${escape(data.text)}
            </div>`;
          },
          item: function (data, escape) {
            return `<div>
              <img src="https://flagcdn.com/24x18/${data.value.slice(0, 2).toLowerCase()}.png" 
                   onerror="this.style.display='none'" 
                   alt="flag" class="me-2" 
                   style="width: 24px; height: 18px; vertical-align: middle;" />
              ${escape(data.text)}
            </div>`;
          }
        }
      });


      new TomSelect("#toCurrencies", {
        placeholder: "กรุณาเลือกหลายสกุลเงิน",
        plugins: ["remove_button"],
        create: false,
        persist: false,
        searchField: ["text"],
        render: {
          option: function (data, escape) {
            return `<div>
              <img src="https://flagcdn.com/24x18/${data.value.slice(0, 2).toLowerCase()}.png" 
                   onerror="this.style.display='none'" 
                   alt="flag" class="me-2" 
                   style="width: 24px; height: 18px; vertical-align: middle;" />
              ${escape(data.text)}
            </div>`;
          },
          item: function (data, escape) {
            return `<div>
              <img src="https://flagcdn.com/24x18/${data.value.slice(0, 2).toLowerCase()}.png" 
                   onerror="this.style.display='none'" 
                   alt="flag" class="me-2" 
                   style="width: 24px; height: 18px; vertical-align: middle;" />
              ${escape(data.text)}
            </div>`;
          }
        },
        onChange() {
          const control = this.control_input;
          control.placeholder = this.items.length ? "" : "กรุณาเลือกหลายสกุลเงิน";
          this.inputState();
          this.setTextboxValue("");
          this.refreshOptions();
        }
      });



      const toSelect = new TomSelect("#toCurrencies", {
        placeholder: "กรุณาเลือกหลายสกุลเงิน",
        plugins: ["remove_button"],
        create: false,
        persist: false,
        searchField: ["text"],
        onChange() {
          const control = this.control_input;
          control.placeholder = this.items.length ? "" : "กรุณาเลือกหลายสกุลเงิน";
          this.inputState();
          this.setTextboxValue("");
          this.refreshOptions();
        },
      });
    })
    .catch(err => {
      console.error("Error loading currencies:", err);
    });
}

function convertCurrency() {
  const amount = parseFloat(amountInput.value);
  const from = fromCurrencySelect.value;
  const selectedCurrencies = Array.from(toCurrenciesSelect.selectedOptions).map(opt => opt.value);

  if (!from || selectedCurrencies.length === 0) {
    alert("กรุณาเลือกสกุลเงินต้นทางและปลายทาง");
    return;
  }

  fetch(`${API_URL}/${API_KEY}/latest/${from}`)
    .then(res => res.json())
    .then(data => {
      resultContainer.innerHTML = "";

      let hasResult = false;

      const title = document.createElement("h3");
      title.className = "text-center mb-2";
      title.textContent = "ผลลัพธ์";
      resultContainer.appendChild(title);

      const hr = document.createElement("hr");
      resultContainer.appendChild(hr);

      selectedCurrencies.forEach(to => {
        const rate = data.conversion_rates[to];
        if (rate) {
          hasResult = true;
          const converted = (rate * amount).toFixed(2);
          const div = document.createElement("div");
          div.textContent = `${amount} ${from} = ${converted} ${to}`;
          div.className = "alert alert-success text-start py-2 my-2 rounded";
          resultContainer.appendChild(div);
        }
      });

      if (!hasResult) {
        resultContainer.innerHTML = `<div class="text-muted">ไม่พบข้อมูลการแปลงสกุลเงิน</div>`;
      }
    })
    .catch(err => {
      console.error("Error fetching conversion:", err);
      resultContainer.innerHTML = `<div class="text-danger">เกิดข้อผิดพลาดในการโหลดข้อมูล</div>`;
    });
}



submitBtn.addEventListener("click", convertCurrency);
window.onload = loadCurrencies;
