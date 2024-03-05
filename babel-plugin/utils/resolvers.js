function aliasResolver(name, CONFIG) {
  if (name in CONFIG?.aliases) {
    return CONFIG.aliases[name];
  }
  return name;
}
function tokenResolver(token, CONFIG) {
  //parse token into array
  if (
    typeof token === 'string' &&
    (token.startsWith('$') || token.startsWith('-$'))
  ) {
    let tokenPath = token.split('$');

    let isNeg = false;
    if (tokenPath[0] === '-') {
      isNeg = true;
    }
    tokenPath = tokenPath.slice(1);
    // resolving for global tokens
    if (tokenPath.length === 1) {
      tokenPath = ['global', tokenPath[0]];
    }
    let value = CONFIG.tokens;
    tokenPath.forEach((key, ind) => {
      if (value) {
        value = value[key];
      }
    });

    if (value) {
      return isNeg ? -1 * value : value;
    }
  }
  return token;
}

module.exports = {
  aliasResolver,
  tokenResolver,
};
