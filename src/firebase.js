import { initializeApp } from 'firebase/app'
import { getFirestore, collection, getDocs, setDoc, doc, addDoc } from 'firebase/firestore'
// ... other firebase imports

const firebaseConfig = {
	apiKey: "AIzaSyBTq1V7bOM_B9q75uIwPdISxjZmVfTK0-4",
	authDomain: "prox-36661.firebaseapp.com",
	projectId: "prox-36661",
	storageBucket: "prox-36661.appspot.com",
	messagingSenderId: "925234634815",
	appId: "1:925234634815:web:665c7f1bd20f7e6eebd88a",
	measurementId: "G-X3RQ3L6HEK"
};

export const firebaseApp = initializeApp(firebaseConfig);

export const db = getFirestore(firebaseApp);

export const materialsRef = collection(db, "materials");

export const getMaterials = async () => {
	const querySnapshot = await getDocs(collection(db, "materials"));
	const materials = [];
	querySnapshot.forEach((doc) => {
		// doc.data() is never undefined for query doc snapshots
		console.log(doc.id, " => ", doc.data());
		materials.push(doc.data());
	});

	return materials;
}

export const addMaterial = async (material) => {
	return await addDoc(collection(db, "materials"), material);
}
