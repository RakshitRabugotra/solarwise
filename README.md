# Solarwise – Solar Potential Estimator  

Solarwise is a tool that helps users calculate the solar potential of their roofs using AI/ML models and geolocation data. It predicts solar energy generation over time and estimates the break-even period and environmental impact.  

---

## 🚀 Features  
### 1. **Solar Potential Calculation**  
- Users select a location and enter the roof area estimate.  
- AI/ML models predict solar radiation (SDLR) over the next **6–10 years** based on historic data.  
- Converts predicted SDLR from **W/m²** to **kWh** adjusted for sunlight hours.  
- Displays results through interactive graphs.  

### 2. **Investment Payback Estimation**  
- Estimates the break-even period based on initial investment and energy savings.  
- Example: A ₹1.5 lakh investment generating energy worth ₹1.5 lakh in **8 years** = 8-year break-even point.  

### 3. **Environmental Impact**  
- Shows the estimated **CO₂ offset** from generated solar energy.  
- Displays the equivalent number of trees saved based on offset data.  

---

## 🛠️ Tech Stack  
### **Frontend:**  
- Next.js  
- TailwindCSS  
- Shadcn/ui  

### **Backend:**  
- Flask (Python)  

### **AI/ML Model:**  
- SARIMA model (trained on historic SDLR data from the CLARA weather dataset)  

---

## 📦 Installation  
1. Clone the repository:  
```bash
git clone https://github.com/RakshitRabugotra/solarwise.git
```

2. Install dependencies:
```bash
cd solarwise  
npm install  
```

3. Start the app:
```bash
cd web
npm run dev  
```
4. Start the backend:
```bash
cd api  
python run.py 
```
---

## 🧪 Testing
- Tested with real-time weather data.
- Verified energy estimates and payback period accuracy.

---

## 👥 Contributors
- Rakshit Rabugotra
- Subhajit Das
- Deepanshu Saini
- Arjun Singh

---

## 📄 License
This project is licensed under the MIT License.