#@+leo-ver=5-thin
#@+node:ekr.20201225052411.1: * @file C:\leo.repo\leojs\src\transliterations\dummyLeoApp.py
"""

leojs/src/transliterations/dummyLeoApp.py:

- Driver for transcript transliterations of Leo's core code.
- Test bed for resulting JS code.
"""

from org.transcrypt.stubs.browser import console

from leo.core import leoFind
from leo.core import leoGlobals
from leo.core import leoMenu
from leo.core import leoNodes
from leo.core import leoUndo
assert leoFind and leoGlobals and leoMenu and leoNodes and leoUndo

def main():
    
    console.log('dummyLeoApp.py:', __file__)
#@-leo
