var hasDotRegex = /\./;
var hasEscapeRegex = /~/;

var escapeMatcher = /~./g;
function escapeReplacer (match) {
  switch (match) {
    case '~1': return '/';
    case '~0': return '~';
  }
  throw new Error(err('Invalid tilde escape', match));
}

function convertPointerToPath (pointer) {
    if (pointer === '') {
        throw new Error(err('Can not convert empty pointer', pointer));
    }
    if (pointer === '/') {
        throw new Error(err(
            'Can not convert standalone root pointer', pointer
        ));
    }
    if (pointer[0] !== '/') {
        throw new Error(err('Can not convert relative pointer', pointer));
    }
    if (hasDotRegex.test(pointer)) {
        throw new Error(err('Unsafe "." in pointer', pointer));
    }

    var tokens = pointer.split('/');
    tokens.shift(); // throwing away token before first '/'

    var converted = [];
    for (var i = 0; i < tokens.length; i += 1) {
        var token = tokens[i];
        if (token) {
            converted.push(
                hasEscapeRegex.test(token)
                ? token.replace(escapeMatcher, escapeReplacer)
                : token
            )
        }
        else {
            throw new Error(err('Empty token in pointer', pointer));
        }
    }

    return converted.join('.');
}

function err (msg, pointer) {
    return (
        msg + ' "' + pointer + '"'
    );
}

module.exports = convertPointerToPath;
