const express = require('express')
const bodyParser = require('body-parser')
const { PORT, DBUser, DBPass, DBHost, DBName, DBPort } = require('./config/index')
const session = require('express-session')
const mysql = require('mysql2/promise')
const MySQLStore = require('express-mysql-session')(session)
const cookieParser = require('cookie-parser')
const cors = require('cors')
const isAuth = require('./middleware/is-auth')

const app = express()
app.set('trust proxy', 1)

const connectionOptions = {
	host: DBHost,
	user: DBUser,
	database: DBName,
	password: DBPass,
	port: DBPort || 3306,
	ssl: {
		rejectUnauthorized: false,
	},
}

const allowedOrigins = ['https://wordlexapp.netlify.app', 'http://localhost:3000']

app.use(
	cors({
		origin: 'https://wordlexapp.netlify.app',
		credentials: true,
		allowedHeaders: ['Content-Type', 'csrf-token', 'CSRF-Token', 'Authorization'],
		methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
	})
)

const connection = mysql.createPool(connectionOptions)
const sessionStore = new MySQLStore({}, connection)

app.use(express.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser('supersecret'))

app.use(
	session({
		key: 'login_session',
		secret: 'supersecret',
		resave: false,
		saveUninitialized: false,
		store: sessionStore,
		cookie: {
			maxAge: 24 * 60 * 60 * 1000,
			httpOnly: true,
			// secure: false,
			// sameSite: 'lax',
			secure: true,
			sameSite: 'none',
		},
	})
)

app.use((req, res, next) => {
	res.locals.isAuthenticated = req.session.isLoggedIn
	next()
})

const authRoutes = require('./routes/auth')
const languagesRouter = require('./routes/languages')
const topicsRouter = require('./routes/topics')
const wordsRouter = require('./routes/words')
const settingsRouter = require('./routes/settings')
const adminRouter = require('./routes/admin')

app.use('/', authRoutes)
app.use('/profile', isAuth, languagesRouter)
app.use('/profile', isAuth, adminRouter)
app.use('/profile', isAuth, settingsRouter)
app.use('/profile', isAuth, topicsRouter)
app.use('/profile', isAuth, wordsRouter)

app.use((err, req, res, next) => {
	if (err.code === 'EBADCSRFTOKEN') {
		return res.status(403).json({
			status: 'error',
			message: 'Błędny token CSRF. Odśwież stronę i spróbuj ponownie.',
		})
	}

	res.status(err.status || 500).json({ status: 'error', message: err.message })
})

app.listen(PORT || 3000)
