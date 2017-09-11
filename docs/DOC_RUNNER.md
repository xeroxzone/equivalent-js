# The Doc Runner

The Doc Runner will try to run documentation generation for all declared modules

## Automated doc generated view in browser

    load system with get parameter "docs" like
    
    e.g.
    http://localhost:8083/?docs
    
to disable the doc runner send

    e.g.
    http://localhost:8083/?docs-stop

### Start live documentation coding

run watcher like described in [README.md][readme](../README.md)

    npm run dev:watch

if doc runner is loaded, the browser refreshes the documentation
from all documentated code changes as long as the mouse cursor 
is not over the browser window.


[readme]: https://github.com/xeroxzone/equivalent-js/blob/master/README.md
