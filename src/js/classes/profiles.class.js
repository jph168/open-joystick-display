const Store = require('electron-store');
const Clone = require('clone');

/*
	Class Profiles
	Handles broadcast profiles for the OJD user.
*/
class Profiles {

	constructor(config) {
		// Electron Store
		this.store = new Store();

		this.config = config;
		
		this.profiles = this.store.get('profiles');
	}

	/* 
		///////////////////////////
	 		Getters
	 	///////////////////////////
	*/

	/*
	 * getCurrentProfile()
	 * @return object
	 * Gets the current profile object.
	 */
	getCurrentProfile() {
		return this.profile;
	}

	/*
	 * getCurrentProfileId()
	 * @return integer
	 * Returns the current profile id
	 */
	getCurrentProfileId() {
		return this.config.getProfile();
	}

	/*
	 * getCurrentProfileMapping()
	 * @return object
	 * Returns the current mapping for the profile.
	 */
	getCurrentProfileMapping() {
		return this.mappings.getMapping(this.config.getProfile());
	}

	/*
	 * getCurrentProfileMap()
	 * @return integer
	 * Returns the current map id for the profile.
	 */
	getCurrentProfileMap() {
		return this.profile.map;
	}

	/*
	 * getCurrentProfileTheme()
	 * @return string
	 * Returns the current theme id for the profile.
	 */
	getCurrentProfileTheme() {
		return this.profile.theme;
	}

	/*
	 * getCurrentProfileThemeStyle()
	 * @return string
	 * Returns the current theme style id for the profile.
	 */
	getCurrentProfileThemeStyle() {
		return this.profile.themeStyle;
	}

	/*
	 * getCurrentProfileAlwaysOnTop()
	 * @return bool
	 * Returns the current state of always on top for the profile.
	 */
	getCurrentProfileAlwaysOnTop() {
		return this.profile.alwaysOnTop;
	}

	/*
	 * getCurrentProfileChroma()
	 * @return bool
	 * Returns the current state of chroma for the profile.
	 */
	getCurrentProfileChroma() {
		return this.profile.chroma;
	}

	/*
	 * getCurrentProfileChromaColor()
	 * @return string
	 * Returns the current color of chroma for the profile.
	 */
	getCurrentProfileChromaColor() {
		return this.profile.chromaColor;
	}

	/*
	 * getCurrentProfileZoom()
	 * @return bool
	 * Returns the current zoom for the profile.
	 */
	getCurrentProfileZoom() {
		return this.profile.zoom;
	}

	/*
	 * getCurrentProfilePoll()
	 * @return bool
	 * Returns the current poll rate for the profile.
	 */
	getCurrentProfilePoll() {
		return this.profile.poll;
	}

	/*
	 * getProfile(id)
	 * @param integer id
	 * @return object
	 * Returns a profile by id.
	 */
	getProfile(id) {
		id = parseInt(id, 10);
		return this.profiles[id];
	}

	/* 
		///////////////////////////
	 		Setters
	 	///////////////////////////
	*/

	/*
	 * setCurrentProfile(id)
	 * @param integer id
	 * @return object
	 * Sets the selected profile and returns the profile object.
	 */
	setCurrentProfile(id) {
		id = parseInt(id, 10);
		id = this.config.setProfile(id);
		this.profile = this.profiles[id];
		this.config.setProfile(id);
		return this.profile;
	}

	/*
	 * setProfileMap(id)
	 * @param integer id
	 * @return NULL
	 * Sets the selected profile map id.
	 */
	setProfileMap(id) {
		id = parseInt(id, 10);
		this.profile.map = id;
		this.saveCurrent();
	}

	/*
	 * setProfileTheme(id)
	 * @param string id
	 * @return NULL
	 * Sets the selected profile theme id.
	 */
	setProfileTheme(id) {
		this.profile.theme = id;
		this.saveCurrent();
	}

	/*
	 * setProfileThemeStyle(id)
	 * @param string id
	 * @return NULL
	 * Sets the selected profile theme style id.
	 */
	setProfileThemeStyle(id) {
		this.profile.themeStyle = id;
		this.saveCurrent();
	}

	/*
	 * toggleProfileAlwaysOnTop()
	 * @return bool
	 * Toggles alwaysOnTop, returns new value.
	 */
	toggleProfileAlwaysOnTop() {
		this.profile.alwaysOnTop = !this.profile.alwaysOnTop;
		this.saveCurrent();
		return this.profile.alwaysOnTop;
	}

	/*
	 * toggleProfileChroma()
	 * @return bool
	 * Toggles chroma, returns new value.
	 */
	toggleProfileChroma() {
		this.profile.chroma = !this.profile.chroma;
		this.saveCurrent();
		return this.profile.chroma;
	}

	/*
	 * setProfileChromaColor(color)
	 * @param string color
	 * @return NULL
	 * Sets the selected profile chroma color.
	 */
	setProfileChromaColor(color) {
		this.profile.chromaColor = color;
		this.saveCurrent();
	}

	/*
	 * setProfilePoll(value)
	 * @param integer value
	 * @return integer
	 * Sets the selected profile poll rate (ms) value. Returns corrected value if need be.
	 */
	setProfilePoll(value) {
		value = parseInt(value, 10);
		if (value < 1) {
			value = 1;
		} else if (value > 100) {
			value = 100;
		}
		this.profile.poll = value;
		this.saveCurrent();
		return value;
	}

	/*
	 * setProfileZoom(zoom)
	 * @param float zoom
	 * @return float
	 * Sets the selected profile zoom. Returns correct value if need be.
	 */
	setProfileZoom(zoom) {
		if (zoom < .25) {
			zoom = .25;
		} else if (zoom > 3) {
			zoom = 3;
		}
		this.profile.zoom = zoom;
		this.saveCurrent();
		return zoom;
	}

	/* 
		///////////////////////////
	 		Operators
	 	///////////////////////////
	*/

	/*
	 * create()
	 * @return integer
	 * Creates a new blank template profile.
	 */
	create() {
		const id = this.profiles.length; // Will always be one ahead. Thanks zero index;
		const profile = require('../../../src/js/data/profile.json');
		this.profiles.push(profile);
		this.setCurrentProfile(id);
		this.save();
		return id;
	}

	/*
	 * clone(id)
	 * @param integer id
	 * @return integer
	 * Creates a new profile based on a previous profile.
	 */
	clone(id) {
		const id = this.profiles.length;
		const profile = Clone(this.getProfile(id));
		profile.name = profile.name + ' (Cloned)';
		this.profiles.push(profile);
		this.setCurrentProfile(id);
		this.save();
		return id;
	}

	/*
	 * remove(id)
	 * @param integer id
	 * @return integer
	 * Removes a profile. If all are removed, a new one will be created in its place.
	 */
	remove(id) {
		this.profiles.splice(id, 1);
		if (this.profiles.length === 0) {
			this.create();
		}
		this.setCurrentProfile(0);
		this.save();
		return 0;
	}


	/*
	 * saveCurrent()
	 * @return NULL
	 * Saves the current profile to the storage.
	 */
	saveCurrent() {
		const id = this.getCurrentProfileId();
		this.profiles[id] = this.profile;
		this.save();
	}

	/*
	 * save()
	 * @return NULL
	 * Saves all profiles
	 */
	save() {
		this.store.set('profiles', this.profiles);
	}

}

module.exports.Profiles = Profiles;