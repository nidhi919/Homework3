import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import firebaseConfig from '../../client-credentials' with { type: 'json' }

export const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
