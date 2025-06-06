import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import MessageModal from "../MessageModal";
import { jsPDF } from 'jspdf';
import { db } from "../../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { motion } from 'framer-motion';
import SubmissionSuccess from '../SubmissionSuccess';

const companyDetails = {
  name: "Blood Donation Hub",
  address: "123 Main Street, Blood City, State, 12345",
  mobile: "+91 98765 43210",
  // Using a placeholder image URL for the logo.
  // In a real application, you might host your logo or convert it to base64.
  logoUrl: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAACBJREFUeNpiYBgFo2AUjIJRMAo0DQwMDAz+//8/CAAIMAD5xA4LJbQOmwAAAABJRU5ErkJggg==",
};

export default function Appointment() {
  const { currentUser, loading } = useAuth();
  const navigate = useNavigate();

  const [showMainModal, setShowMainModal] = useState(false);
  const [mainModalMessage, setMainModalMessage] = useState('');
  const [isAuthCheckComplete, setIsAuthCheckComplete] = useState(false);
  const [showDownloadButton, setShowDownloadButton] = useState(false); // New state for download button
  const [isFormSubmitted, setIsFormSubmitted] = useState(false); // New state for tracking form submission
  const [isSubmitting, setIsSubmitting] = useState(false); // Add this state for submission animation
  const [showSuccess, setShowSuccess] = useState(false);

  // Effect to handle redirection if not logged in
  useEffect(() => {
    if (!loading && !isAuthCheckComplete) {
      setIsAuthCheckComplete(true);

      if (!currentUser) {
        setMainModalMessage("Please login first to book an appointment.");
        setShowMainModal(true);

        const timer = setTimeout(() => {
          navigate("/login");
        }, 3000);
        return () => clearTimeout(timer);
      }
    }
  }, [currentUser, loading, navigate, isAuthCheckComplete]);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    birthDate: "",
    state: "",
    district: "",
    add: "",
    add2: "",
    pincode: "",
    bloodGroup: "",
    appointmentDate: "",
  });

  // Data for states and districts (using the example structure from previous turn)
  // You would import this from a separate file like '../../data/indianStatesAndDistricts';
  const indianStatesAndDistricts = {

    // Add all other states and their districts here
    "Andhra Pradesh": [
      "Anantapur", "Chittoor", "East Godavari", "Guntur", "Krishna", "Kurnool",
      "Nellore", "Prakasam", "Srikakulam", "Visakhapatnam", "Vizianagaram",
      "West Godavari", "YSR Kadapa"
    ],
    "Arunachal Pradesh": [
      "Anjaw", "Changlang", "Dibang Valley", "East Kameng", "East Siang",
      "Kra Daadi", "Kurung Kumey", "Lohit", "Longding", "Lower Dibang Valley",
      "Lower Siang", "Lower Subansiri", "Namsai", "Pakke Kessang", "Papum Pare",
      "Shi Yomi", "Siang", "Tawang", "Tirap", "Upper Dibang Valley",
      "Upper Siang", "Upper Subansiri", "West Kameng", "West Siang"
    ],
    "Assam": [
      "Baksa", "Barpeta", "Biswanath", "Bongaigaon", "Cachar", "Charaideo",
      "Chirang", "Darrang", "Dhemaji", "Dhubri", "Dibrugarh", "Dima Hasao",
      "Goalpara", "Golaghat", "Hailakandi", "Hojai", "Jorhat", "Kamrup Metropolitan",
      "Kamrup", "Karbi Anglong", "Karimganj", "Kokrajhar", "Lakhimpur", "Majuli",
      "Morigaon", "Nagaon", "Nalbari", "Sivasagar", "Sonitpur", "South Salmara-Mankachar",
      "Tinsukia", "Udalguri", "West Karbi Anglong"
    ],
    "Bihar": [
      "Araria", "Arwal", "Aurangabad", "Banka", "Begusarai", "Bhagalpur", "Bhojpur",
      "Buxar", "Darbhanga", "East Champaran", "Gaya", "Gopalganj", "Jamui", "Jehanabad",
      "Kaimur", "Katihar", "Khagaria", "Kishanganj", "Lakhisarai", "Madhepura",
      "Madhubani", "Munger", "Muzaffarpur", "Nalanda", "Nawada", "Patna", "Purnia",
      "Rohtas", "Saharsa", "Samastipur", "Saran", "Sheikhpura", "Sheohar", "Sitamarhi",
      "Siwan", "Supaul", "Vaishali", "West Champaran"
    ],
    "Chhattisgarh": [
      "Balod", "Baloda Bazar", "Balrampur", "Bastar", "Bemetara", "Bijapur",
      "Bilaspur", "Dantewada", "Dhamtari", "Durg", "Gariaband", "Gaurela-Pendra-Marwahi",
      "Janjgir-Champa", "Jashpur", "Kabirdham", "Kanker", "Kondagaon", "Korba",
      "Koriya", "Mahasamund", ""
    ],
    "Goa": [
      "North Goa", "South Goa"
    ],
    "Gujarat": [
      "Ahmedabad", "Amreli", "Anand", "Aravalli", "Banaskantha", "Bharuch",
      "Bhavnagar", "Botad", "Chhota Udaipur", "Dahod", "Dang", "Devbhoomi Dwarka",
      "Gandhinagar", "Gir Somnath", "Jamnagar", "Junagadh", "Kheda", "Kutch",
      "Mahisagar", "Mehsana", "Morbi", "Narmada", "Navsari", "Panchmahal",
      "Patan", "Porbandar", "Rajkot", "Sabarkantha", "Surat", "Surendranagar",
      "Tapi", "Valsad", "Vadodara"
    ],
    "Haryana": [
      "Ambala", "Bhiwani", "Charkhi Dadri", "Faridabad", "Fatehabad", "Gurugram",
      "Hisar", "Jhajjar", "Jind", "Kaithal", "Karnal", "Kurukshetra", "Mahendragarh",
      "Nuh", "Palwal", "Panchkula", "Panipat", "Rewari", "Rohtak", "Sirsa",
      "Sonipat", "Yamunanagar"
    ],
    "Himachal Pradesh": [
      "Bilaspur", "Chamba", "Hamirpur", "Kangra", ""
    ],
    "Jharkhand": [
      "Bokaro", "Chatra", "Deoghar", "Dhanbad", "Dumka", "East Singhbhum",
      "Garhwa", "Giridih", "Godda", "Gumla", "Hazaribagh", "Jamtara", "Khunti",
      "Koderma", "Latehar", "Lohardaga", "Pakur", "Palamu", "Ramgarh", "Ranchi",
      "Sahebganj", "Seraikela Kharsawan", "Simdega", "West Singhbhum"
    ],
    "Karnataka": [
      "Bagalkot", "Ballari (Bellary)", "Belagavi (Belgaum)", "Bengaluru Rural",
      "Bengaluru Urban", "Bidar", "Chamarajanagar", "Chikkaballapur",
      "Chikkamagaluru (Chikmagalur)", "Chitradurga", "Dakshina Kannada",
      "Davangere", "Dharwad", "Gadag", "Hassan", "Haveri", "Kalaburagi (Gulbarga)",
      "Kodagu (Coorg)", "Kolar", "Koppal", "Mandya", "Mysuru (Mysore)", "Raichur",
      "Ramanagara", "Shivamogga (Shimoga)", "Tumakuru (Tumkur)", "Udupi",
      "Uttara Kannada (Karwar)", "Vijayapura (Bijapur)", "Yadgir"
    ],
    "Kerala": [
      "Alappuzha", "Ernakulam", "Idukki", "Kannur", "Kasaragod", "Kollam",
      "Kottayam", "Kozhikode", "Malappuram", "Palakkad", "Pathanamthitta",
      "Thiruvananthapuram", "Thrissur", "Wayanad"
    ],
    "Madhya Pradesh": [
      "Agar Malwa", "Alirajpur", "Anuppur", "Ashoknagar", "Balaghat", "Barwani",
      "Betul", "Bhind", "Bhopal", "Burhanpur", "Chhatarpur", "Chhindwara",
      "Damoh", "Datia", "Dewas", "Dhar", "Dindori", "Guna", "Gwalior", "Harda",
      "Hoshangabad", "Indore", "Jabalpur", "Jhabua", "Katni", "Khandwa",
      "Khargone", "Mandla", "Mandsaur", "Morena", "Narsinghpur", "Neemuch",
      "Panna", "Raisen", "Rajgarh", "Ratlam", "Rewa", "Sagar", "Satna",
      "Sehore", "Seoni", "Shahdol", "Shajapur", "Sheopur", "Shivpuri", "Sidhi",
      "Singrauli", "Tikamgarh", "Ujjain", "Umaria", "Vidisha"
    ],
    "Maharashtra": [
      "Ahmednagar", "Akola", "Amravati", "Aurangabad", "Beed", "Bhandara",
      "Buldhana", "Chandrapur", "Dhule", "Gadchiroli", "Gondia", "Hingoli",
      "Jalgaon", "Jalna", "Kolhapur", "Latur", "Mumbai City", "Mumbai Suburban",
      "Nagpur", "Nanded", ""
    ],
    "Manipur": [
      "Bishnupur", "Chandel", "Churachandpur", "Imphal East", "Imphal West",
      "Jiribam", "Kakching", "Kamjong", "Kangpokpi", "Noney", "Pherzawl",
      "Senapati", "Tamenglong", "Tengnoupal", "Thoubal", "Ukhrul"
    ],
    "Meghalaya": [
      "East Garo Hills", "East Jaintia Hills", "East Khasi Hills", "North Garo Hills",
      "Ri Bhoi", "South Garo Hills", "South West Garo Hills", "South West Khasi Hills",
      "West Garo Hills", "West Jaintia Hills", "West Khasi Hills"
    ],
    "Mizoram": [
      "Aizawl", "Champhai", "Hnahthial", "Khawzawl", "Kolasib", "Lawngtlai",
      "Lunglei", "Mamit", "Saiha", "Serchhip"
    ],
    "Nagaland": [
      "Dimapur", "Kiphire", "Kohima", "Longleng", "Mokokchung", "Mon",
      "Peren", "Phek", "Tuensang", "Wokha", "Zunheboto"
    ],
    "Odisha": [
      "Angul", "Balangir", "Balasore", "Bargarh", "Bhadrak", "Boudh",
      "Cuttack", "Debagarh (Deogarh)", "Dhenkanal", "Gajapati", "Ganjam",
      "Jagatsinghpur", "Jajpur", "Jharsuguda", "Kalahandi", "Kandhamal",
      "Kendrapara", "Kendujhar (Keonjhar)", "Khordha", "Koraput", "Malkangiri",
      "Mayurbhanj", "Nabarangpur", "Nayagarh", "Nuapada", "Puri", "Rayagada",
      "Sambalpur", "Subarnapur (Sonepur)", "Sundargarh"
    ],
    "Punjab": [
      "Amritsar", "Barnala", "Bathinda", "Faridkot", "Fatehgarh Sahib",
      "Fazilka", "Ferozepur", "Gurdaspur", "Hoshiarpur", "Jalandhar",
      "Kapurthala", "Ludhiana", "Mansa", "Moga", "Muktsar", "Pathankot",
      "Patiala", "Rupnagar", "Sahibzada Ajit Singh Nagar (Mohali)",
      "Sangrur", "Shaheed Bhagat Singh Nagar (Nawanshahr)", "Sri Muktsar Sahib",
      "Tarn Taran"
    ],
    "Rajasthan": [
      "Ajmer", "Alwar", "Banswara", "Baran", "Barmer", "Bhilwara", "Bikaner",
      "Bundi", "Chittorgarh", "Churu", "Dausa", "Dholpur", "Dungarpur",
      "Hanumangarh", "Jaipur", "Jaisalmer", "Jalore", "Jhalawar", "Jhunjhunu",
      "Jodhpur", "Karauli", "Kota", "Nagaur", "Pali", "Pratapgarh", "Rajsamand",
      "Sawai Madhopur", "Sikar", "Sirohi", "Sri Ganganagar", "Tonk", "Udaipur"
    ],
    "Sikkim": [
      "East Sikkim", "North Sikkim", "South Sikkim", "West Sikkim"
    ],
    "Tamil Nadu": [
      "Ariyalur", "Chengalpattu", "Chennai", "Coimbatore", "Cuddalore",
      "Dharmapuri", "Dindigul", "Erode", "Kallakurichi", "Kancheepuram",
      "Kanyakumari", "Karur", "Krishnagiri", "Madurai", "Mayiladuthurai",
      "Nagapattinam", "Namakkal", "Nilgiris", "Perambalur", "Pudukkottai",
      "Ramanathapuram", "Ranipet", "Salem", "Sivaganga", "Tenkasi",
      "Thanjavur", "Theni", "Thoothukudi (Tuticorin)", "Tiruchirappalli",
      "Tirunelveli", "Tirupattur", "Tiruppur", "Tiruvallur", "Tiruvannamalai",
      "Tiruvarur", "Vellore", "Viluppuram", "Virudhunagar"
    ],
    "Telangana": [
      "Adilabad", "Bhadradri Kothagudem", "Hyderabad", "Jagtial", "Jangaon",
      "Jayashankar Bhupalpally", "Jogulamba Gadwal", "Kamareddy", "Karimnagar",
      "Khammam", "Komaram Bheem", "Mahabubabad", "Mahabubnagar", "Mancherial",
      "Medak", "Medchal–Malkajgiri", "Mulugu", "Nagarkurnool", "Nalgonda",
      "Narayanpet", "Nirmal", "Nizamabad", "Peddapalli", "Rajanna Sircilla",
      "Ranga Reddy", "Sangareddy", "Siddipet", "Suryapet", "Vikarabad",
      "Wanaparthy", "Warangal Rural", "Warangal Urban", "Yadadri Bhuvanagiri"
    ],
    "Tripura": [
      "Dhalai", "Gomati", "Khowai", "North Tripura", "Sepahijala",
      "South Tripura", "Unakoti", "West Tripura"
    ],
    "Uttar Pradesh": [
      "Agra", "Aligarh", "Ambedkar Nagar", "Amethi", "Amroha", "Auraiya",
      "Ayodhya", "Azamgarh", "Baghpat", "Bahraich", "Ballia", "Balrampur",
      "Banda", "Bara Banki", "Bareilly", "Basti", "Bhadohi", "Bijnor",
      "Budaun", "Bulandshahr", "Chandauli", "Chitrakoot", "Deoria", "Etah",
      "Etawah", "Farrukhabad", "Fatehpur", "Firozabad", "Gautam Buddha Nagar",
      "Ghaziabad", "Ghazipur", "Gonda", "Gorakhpur", "Hamirpur", "Hapur",
      "Hardoi", "Hathras", "Jalaun", "Jaunpur", "Jhansi", "Kannauj", "Kanpur Dehat",
      "Kanpur Nagar", "Kasganj", "Kaushambi", "Kheri", "Kushinagar", "Lakhimpur Kheri",
      "Lalitpur", "Lucknow", "Maharajganj", "Mahoba", "Mainpuri", "Mathura",
      "Mau", "Meerut", "Mirzapur", "Moradabad", "Muzaffarnagar", "Pilibhit",
      "Pratapgarh", "Prayagraj", "Raebareli", "Rampur", "Saharanpur", "Sambhal",
      "Sant Kabir Nagar", "Shahjahanpur", "Shamli", "Shrawasti", "Siddharthnagar",
      "Sitapur", "Sonbhadra", "Sultanpur", "Unnao", "Varanasi"
    ],
    "Uttarakhand": [
      "Almora", "Bageshwar", "Chamoli", "Champawat", "Dehradun", "Haridwar",
      "Nainital", "Pauri Garhwal", "Pithoragarh", "Rudraprayag", "Tehri Garhwal",
      "Udham Singh Nagar", "Uttarkashi"
    ],
    "West Bengal": [
      "Alipurduar", "Bankura", "Paschim Bardhaman (West Bardhaman)",
      "Purba Bardhaman (East Bardhaman)", "Birbhum", "Cooch Behar",
      "Dakshin Dinajpur (South Dinajpur)", "Darjeeling", "Hooghly", "Howrah",
      "Jalpaiguri", "Jhargram", "Kalimpong", "Kolkata", "Malda", "Murshidabad",
      "Nadia", "North 24 Parganas", "Paschim Medinipur (West Medinipur)",
      "Purba Medinipur (East Medinipur)", "Purulia", "South 24 Parganas",
      "Uttar Dinajpur (North Dinajpur)"
    ],
    // Union Territories
    "Andaman and Nicobar Islands": [
      "Nicobar", "North and Middle Andaman", "South Andaman"
    ],
    "Chandigarh": [
      "Chandigarh"
    ],
    "Dadra and Nagar Haveli and Daman and Diu": [
      "Dadra and Nagar Haveli", "Daman", "Diu"
    ],
    "Lakshadweep": [
      "Lakshadweep"
    ],
    "Delhi (National Capital Territory of Delhi)": [
      "Central Delhi", "East Delhi", "New Delhi", "North Delhi", "North East Delhi",
      "North West Delhi", "Shahdara", "South Delhi", "South East Delhi",
      "South West Delhi", "West Delhi"
    ],
    "Puducherry": [
      "Karaikal", "Mahe", "Puducherry", "Yanam"
    ],
    "Ladakh": [
      "Kargil", "Leh"
    ],
    "Jammu and Kashmir": [
      "Anantnag", "Bandipora", "Baramulla", "Budgam", "Doda", "Ganderbal",
      "Jammu", "Kathua", "Kishtwar", "Kulgam", "Kupwara", ""
    ]

  };


  const states = Object.keys(indianStatesAndDistricts);
  const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevFormData => {
      if (name === "state") {
        return { ...prevFormData, [name]: value, district: "" }; // Reset district if state changes
      }
      return { ...prevFormData, [name]: value };
    });
  };

  // Function to generate the PDF
  const generateAppointmentPdf = (data) => {
    const doc = new jsPDF();

    // Add Company Logo and Details
    const img = new Image();
    img.src = companyDetails.logoUrl;
    img.onload = () => {
      // Add image (x, y, width, height)
      doc.addImage(img, 'PNG', 10, 10, 30, 15);

      // Company Name, Address, Mobile
      doc.setFontSize(10);
      doc.setTextColor(50, 50, 50); // Dark gray color
      doc.text(companyDetails.name, 200, 15, { align: 'right' });
      doc.text(companyDetails.address, 200, 20, { align: 'right' });
      doc.text(companyDetails.mobile, 200, 25, { align: 'right' });

      // Add a separator line below the header
      doc.setLineWidth(0.5);
      doc.setDrawColor(200, 0, 0); // Red color for the line
      doc.line(10, 35, 200, 35); // x1, y1, x2, y2

      // Add Appointment Details
      let yPos = 45;
      doc.setFontSize(16);
      doc.setTextColor(223, 8, 15); // Your theme red color
      doc.text("Appointment Details", 10, yPos);
      yPos += 10;

      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0); // Black color for details

      // Helper to format keys to readable labels
      const formatLabel = (key) => {
        return key.replace(/([A-Z])/g, ' $1') // Add space before capital letters
          .replace(/^./, str => str.toUpperCase()); // Capitalize first letter
      };

      for (const key in data) {
        if (Object.prototype.hasOwnProperty.call(data, key)) {
          const label = formatLabel(key);
          doc.text(`${label}: ${data[key]}`, 15, yPos);
          yPos += 7; // Increment y position for next line
          if (yPos > 280) { // Check for page overflow (A4 height is ~297mm)
            doc.addPage(); // Add a new page if content exceeds current page
            yPos = 10; // Reset y position for the new page
          }
        }
      }

      // Save the PDF
      doc.save(`Appointment_${data.fullName.replace(/\s/g, '_')}.pdf`);
    };
    img.onerror = () => {
      console.error("Failed to load logo image for PDF.");
      // Proceed with PDF generation without logo if it fails to load
      doc.setFontSize(10);
      doc.setTextColor(50, 50, 50);
      doc.text(companyDetails.name, 200, 15, { align: 'right' });
      doc.text(companyDetails.address, 200, 20, { align: 'right' });
      doc.text(companyDetails.mobile, 200, 25, { align: 'right' });
      doc.setLineWidth(0.5);
      doc.setDrawColor(200, 0, 0);
      doc.line(10, 35, 200, 35);

      let yPos = 45;
      doc.setFontSize(16);
      doc.setTextColor(223, 8, 15);
      doc.text("Appointment Details", 10, yPos);
      yPos += 10;

      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0);

      const formatLabel = (key) => {
        return key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
      };

      for (const key in data) {
        if (Object.prototype.hasOwnProperty.call(data, key)) {
          const label = formatLabel(key);
          doc.text(`${label}: ${data[key]}`, 15, yPos);
          yPos += 7;
          if (yPos > 280) {
            doc.addPage();
            yPos = 10;
          }
        }
      }
      doc.save(`Appointment_${data.fullName.replace(/\s/g, '_')}.pdf`);
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setIsSubmitting(true);
      
      // Create appointment data
      const appointmentData = {
        ...formData,
        userId: currentUser.uid,
        userEmail: currentUser.email,
        // Convert date string to Date object
        appointmentDate: new Date(formData.appointmentDate),
        createdAt: serverTimestamp(),
        status: 'pending'
      };

      // Save to Firestore
      await addDoc(collection(db, "appointments"), appointmentData);
      
      setIsFormSubmitted(true);
      // Generate PDF
      generateAppointmentPdf(formData);

      // Redirect after animation
      setTimeout(() => {
        navigate('/');
      }, 3000);

    } catch (error) {
      console.error("Error saving appointment: ", error);
      setMainModalMessage("Error booking appointment. Please try again.");
      setShowMainModal(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Function to validate form data before submission
  const validateForm = () => {
    // Add any specific validation rules here
    if (!formData.fullName || !formData.mobile || !formData.email) {
      setMainModalMessage("Please fill all required fields");
      setShowMainModal(true);
      return false;
    }
    return true;
  };

  const handleCloseModal = () => {
    setShowMainModal(false);
    setMainModalMessage('');
    setShowDownloadButton(false);
  };

  const handleDownloadPdf = () => {
    generateAppointmentPdf(formData);
  };

  const formAnimation = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1
      }
    }
  };

  const inputAnimation = {
    hidden: { opacity: 0, x: -20 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { duration: 0.3 }
    }
  };

  // --- Render Logic based on Authentication State ---
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-xl font-semibold">Loading authentication status...</p>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <MessageModal
        message={mainModalMessage}
        onClose={handleCloseModal}
        isVisible={showMainModal}
      />
    );
  }

  return (
    <>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="min-h-screen pt-20" // Changed padding and removed bg-gray-50
        style={{
          background: `
            radial-gradient(circle at 100% 0%, rgba(223, 8, 15, 0.08) 0%, transparent 25%),
            radial-gradient(circle at 0% 100%, rgba(223, 8, 15, 0.08) 0%, transparent 25%),
            linear-gradient(135deg, #ffffff 0%, #f7f7f7 100%)
          `,
          backgroundAttachment: 'fixed'
        }}
      >
        {/* Decorative Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-96 -right-96 w-192 h-192">
            <div className="absolute w-full h-full bg-red-50 rounded-full opacity-20 blur-3xl"></div>
          </div>
          <div className="absolute -bottom-96 -left-96 w-192 h-192">
            <div className="absolute w-full h-full bg-red-50 rounded-full opacity-20 blur-3xl"></div>
          </div>
        </div>

        {/* Content Container */}
        <div className="relative z-10">
          <motion.div 
            className="max-w-3xl mx-auto bg-white/80 backdrop-blur-sm shadow-xl rounded-2xl overflow-hidden border border-red-100"
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="relative p-8">
              {/* Small decorative circles */}
              <div className="absolute top-0 left-0 w-20 h-20 bg-red-50 rounded-full -translate-x-1/2 -translate-y-1/2 blur-2xl opacity-60"></div>
              <div className="absolute top-0 right-0 w-20 h-20 bg-red-50 rounded-full translate-x-1/2 -translate-y-1/2 blur-2xl opacity-60"></div>

              <motion.h2 
                className="text-3xl font-bold text-center text-[#df080f] mb-8 relative"
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                Book Appointment
                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-20 h-1 bg-[#df080f] rounded-full opacity-50"></div>
              </motion.h2>

              {/* Success Message */}
              {isFormSubmitted && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="mb-8 p-6 bg-green-50 rounded-xl border border-green-200"
                >
                  <p className="text-green-700 text-center text-lg mb-4">
                    Appointment booked successfully! 🎉
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => generateAppointmentPdf(formData)}
                    className="w-full bg-[#df080f] text-white py-3 rounded-lg hover:bg-red-700 transition-all duration-300 flex items-center justify-center gap-2 shadow-md"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                    Download Appointment PDF
                  </motion.button>
                </motion.div>
              )}

              {/* Form */}
              <motion.form 
                onSubmit={handleSubmit}
                variants={formAnimation}
                initial="hidden"
                animate="visible"
                className="space-y-6"
              >
                {/* Grid Layout for Form Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Full Name */}
                  <motion.div variants={inputAnimation} className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
                      placeholder="Enter your full name"
                    />
                  </motion.div>

                  {/* Mobile & Email side by side */}
                  <motion.div variants={inputAnimation}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Mobile Number
                    </label>
                    <input
                      type="tel"
                      name="mobile"
                      value={formData.mobile}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
                      placeholder="Enter mobile number"
                    />
                  </motion.div>

                  <motion.div variants={inputAnimation}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
                      placeholder="Enter email address"
                    />
                  </motion.div>

                  {/* Date of Birth */}
                  <motion.div variants={inputAnimation}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Date of Birth
                    </label>
                    <input
                      type="date"
                      name="birthDate"
                      value={formData.birthDate}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
                    />
                  </motion.div>

                  {/* State */}
                  <motion.div variants={inputAnimation}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      State
                    </label>
                    <select
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
                    >
                      <option value="">--Select State--</option>
                      {states.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </motion.div>

                  {/* District */}
                  <motion.div variants={inputAnimation}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      District
                    </label>
                    <select
                      name="district"
                      value={formData.district}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
                      disabled={!formData.state}
                    >
                      <option value="">--Select District--</option>
                      {formData.state && indianStatesAndDistricts[formData.state]?.map((d) => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                  </motion.div>

                  {/* Address Line 1 */}
                  <motion.div variants={inputAnimation} className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Address Line 1
                    </label>
                    <input
                      type="text"
                      name="add1"
                      value={formData.add1}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
                      placeholder="Enter your address"
                    />
                  </motion.div>

                  {/* Address Line 2 */}
                  <motion.div variants={inputAnimation} className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Address Line 2
                    </label>
                    <input
                      type="text"
                      name="add2"
                      value={formData.add2}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
                      placeholder="Optional"
                    />
                  </motion.div>

                  {/* Pincode */}
                  <motion.div variants={inputAnimation}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Pincode
                    </label>
                    <input
                      type="number"
                      name="pincode"
                      value={formData.pincode}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
                      placeholder="Enter your pincode"
                    />
                  </motion.div>

                  {/* Blood Group */}
                  <motion.div variants={inputAnimation}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Blood Group
                    </label>
                    <select
                      name="bloodGroup"
                      value={formData.bloodGroup}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
                    >
                      <option value="">--Select Blood Group--</option>
                      {bloodGroups.map((bg) => <option key={bg} value={bg}>{bg}</option>)}
                    </select>
                  </motion.div>

                  {/* Appointment Date */}
                  <motion.div variants={inputAnimation}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Appointment Date
                    </label>
                    <input
                      type="date"
                      name="appointmentDate"
                      value={formData.appointmentDate}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
                    />
                  </motion.div>
                </div>

                {/* Submit Button */}
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full py-3 px-6 rounded-lg font-semibold transition-all duration-300 shadow-md mt-8 ${
                    isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#df080f] hover:bg-red-700'
                  } text-white`}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center">
                      <motion.div
                        className="w-6 h-6 border-3 border-white border-t-transparent rounded-full"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      />
                      <span className="ml-2">Submitting...</span>
                    </div>
                  ) : (
                    'Book Appointment'
                  )}
                </motion.button>
              </motion.form>
            </div>
          </motion.div>
        </div>

        <MessageModal
          isVisible={showMainModal}
          message={mainModalMessage}
          onClose={handleCloseModal}
          showDownloadButton={showDownloadButton}
          onDownload={handleDownloadPdf}
        />

        {/* Success Animation - Shown when form is successfully submitted */}
        {showSuccess && (
          <SubmissionSuccess message="Appointment Booked Successfully!" />
        )}
      </motion.div>
    </>
  );
}


