'use strict';
var { expect } = require('chai');
var convert = require('../src/');

describe('convertPointerToPath()', () => {
    it('properly converts valid paths', () => {
        var pairs = [
            [ '/foo', 'foo' ],
            [ '/foo/bar', 'foo.bar' ],
            [ '/foo/bar/baz', 'foo.bar.baz' ],
            [ '/foo/0', 'foo.0' ],
            [ '/foo/1/2/bar', 'foo.1.2.bar' ],
            [ '/~0foo/bar', '~foo.bar' ],
            [ '/foo~1/bar', 'foo/.bar'],
        ];

        for (var it of pairs) {
            expect(convert(it[0])).to.equal(it[1]);
        }
    });

    it('throws on invalid/unconvertible paths', () => {
        var paths = [
            [ '', 'Can not convert empty pointer' ],
            [ '//foo/bar', 'Empty token in pointer' ],
            [ '/foo//bar', 'Empty token in pointer' ],
            [ '/fo.o/bar', 'Unsafe "." in pointer' ],
            [ '/', 'Can not convert standalone root pointer' ],
            [ 'foo/bar', 'Can not convert relative pointer' ],
            [ '/fo~3/bar', 'Invalid tilde escape', '~3' ],
        ];

        for (var it of paths) {
            var error = undefined;
            try {
                convert(it[0]);
            }
            catch (e) {
                error = e;
            }
            expect(error).to.exist;
            expect(error.message).to.equal(`${it[1]} "${it[2] || it[0]}"`);
        }
    });
})
