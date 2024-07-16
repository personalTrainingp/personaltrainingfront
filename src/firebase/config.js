// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getStorage, ref, uploadBytes } from 'firebase/storage';
import { getAnalytics } from 'firebase/analytics';
import { v4 } from 'uuid';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
	apiKey: 'AIzaSyBgJBaP12ubOwBHcGNKuSuTxdx5XDws_og',
	authDomain: 'changeportal-123.firebaseapp.com',
	projectId: 'changeportal-123',
	storageBucket: 'changeportal-123.appspot.com',
	messagingSenderId: '671409110585',
	appId: '1:671409110585:web:164cd185241ad487b457e8',
	measurementId: 'G-V99J4CPZF2',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);

export const uploadFilesAvatar = (file) => {
	const storageRef = ref(storage, v4());
	uploadBytes(storageRef, file).then((snap) => {
		console.log(snap);
	});
};
