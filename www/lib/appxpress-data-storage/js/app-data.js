/**
 * localStorage library
 */

if (typeof (storage) !== "undefined") {

	/**
	 * store data locally
	 */
	var AppData = function() {

		/**
		 * store the value in localStorage
		 * 
		 * @parameters: key and value
		 */

		this.set = function(key, value) {
			if (value === undefined) {
				return this.remove(key)
			}
			localStorage.setItem(key, this.serialize(value));
		};

		/**
		 * get the value form localStorage
		 * 
		 * @parameter : key
		 * @return : value
		 */

		this.get = function(key) {
			var value = this.deserialize(localStorage.getItem(key));
			return value;
		};

		/**
		 * remove the value from localStorage
		 * 
		 * @parameter : key
		 */

		this.remove = function(key) {
			localStorage.removeItem(key);
		};

		/**
		 * Removes all of the key value pairs.
		 */
		this.clear = function() {
			localStorage.clear();
		};

		/**
		 * convert the value in to string
		 * 
		 * @parameter : value
		 */

		this.serialize = function(value) {
			return JSON.stringify(value);
		};

		/**
		 * convert the string in to a object
		 * 
		 * @parameter : value
		 * @return : object
		 */

		this.deserialize = function(value) {
			if (typeof value != 'string') {
				return value;
			}
			try {
				return JSON.parse(value);
			} catch (e) {
				return value;
			}
		};

	};

	/**
	 * use this object for method call.
	 */
	var appData = new AppData();

} else {
	alert("Sorry! No Web Storage support..");
}
