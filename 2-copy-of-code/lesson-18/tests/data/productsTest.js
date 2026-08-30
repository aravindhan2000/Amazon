import {loadProductsFetch, searchProducts} from '../../data/products.js';

describe('test suite: searchProducts', () => {
  beforeAll(async () => {
    await loadProductsFetch();
  });

  it('returns every product when the search is empty', () => {
    expect(searchProducts('').length).toEqual(searchProducts().length);
    expect(searchProducts('   ').length).toBeGreaterThan(0);
  });

  it('matches products by name, ignoring case', () => {
    const results = searchProducts('BASKETBALL');

    expect(results.length).toBeGreaterThan(0);
    results.forEach((product) => {
      const matchesName = product.name.toLowerCase().includes('basketball');
      const matchesKeyword = product.keywords.some(
        (keyword) => keyword.toLowerCase().includes('basketball')
      );
      expect(matchesName || matchesKeyword).toEqual(true);
    });
  });

  it('matches products by keyword', () => {
    expect(searchProducts('socks').length).toBeGreaterThan(0);
  });

  it('returns nothing when no product matches', () => {
    expect(searchProducts('zzzzzzzz').length).toEqual(0);
  });
});
