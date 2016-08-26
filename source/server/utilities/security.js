export function* isLoggedIn (next) {
	if (this.session.isLoggedIn) {
		yield* next;
	} else {
		this.body = {
			error: 'unauthorized'
		};
		this.status = 401;
	}
}

export function* isAdmin (next) {
	if (this.session.isAdmin) {
		yield* next;
	} else {
		this.body = {
			error: 'forbidden'
		};
		this.status = 403;
	}
}
