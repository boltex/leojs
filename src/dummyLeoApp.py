#@+leo-ver=5-thin
#@+node:ekr.20201225052411.1: * @file C:\leo.repo\leojs\src\dummyLeoApp.py
"""

leojs/src/transliterations/dummyLeoApp.py:

- Driver for transcrypt transliterations of Leo's core code.
- Test bed for the resulting JS code.
"""

from org.transcrypt.stubs.browser import console

# Tell transcrypt to compile these files.
from leo.core import leoFind
from leo.core import leoGlobals as g
from leo.core import leoMenu
from leo.core import leoNodes
from leo.core import leoUndo
# Tell pyflakes (and jslint) to chill.
assert console and g and leoFind and leoMenu and leoNodes and leoUndo

# def main():
    # console.log('dummyLeoApp.py:', __file__)
    # test()

def test():
    g.trace('=====')
    
#@@language python
#@-leo
