// https://en.wikipedia.org/wiki/Lehmer_random_number_generator
typedef __UINT64_TYPE__ uint64_t;

static unsigned __int128 state;

/* The state must be seeded with an odd value. */
void seed(unsigned __int128 seed) {
	state = seed << 1 | 1;
}

uint64_t random(void) {
	const unsigned __int128 mult =
		(unsigned __int128)0x12e15e35b500f16e << 64 |
		0x2e714eb2b37916a5;
	state *= mult;
	return state >> 64;
}