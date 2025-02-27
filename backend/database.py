import mysql.connector as ms
from mysql.connector import Error

def get_db_connection(
		database : str = None
) :
	
		connection = ms.connect(
			host = "127.0.0.1",
			user = 'root',
			password = 'Lepaku@2027',
			port=3307 )
		
		cursor = connection.cursor()

		if database:
				cursor.execute(f"SHOW DATABASES LIKE '{database}'")
				result = cursor.fetchone()

				if not result:
					try:
						cursor.execute(f"CREATE DATABASE `{database}`")
						connection.commit()

					except ms.Error as e:
						connection.close()
						raise Exception(f"Error creating database: {str(e)}")

		if database:
			connection.database = database

		return connection				
