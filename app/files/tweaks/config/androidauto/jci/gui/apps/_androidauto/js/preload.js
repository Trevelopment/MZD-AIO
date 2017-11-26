
function AAInstallHook()
{
    if (this.hookInstalled == true)
        return;

    var showOperaSurface_orig = framework.showOperaSurface.bind(framework);
    var showTemplateSurfaces_orig = framework._showTemplateSurfaces.bind(framework);
    var hideTemplateSurfaces_orig = framework._hideTemplateSurfaces.bind(framework);
    var hasAAVideoFocus = function()
    {
        var ret = false;
        try
        {
            var currentStatus = null;
            var xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function()
            {
                if (xhttp.readyState == 4)
                {
                    if (xhttp.status == 200)
                    {
                        currentStatus = JSON.parse(xhttp.responseText);
                    }
                }
            };
            xhttp.open("GET", "http://localhost:9999/status", false);
            xhttp.send();
            if (currentStatus != null && currentStatus.videoFocus && currentStatus.connected)
            {
                ret = true;
            }
        }
        catch(err)
        {
            //do nothing
        }
        return ret;
    };

    framework.showOperaSurface = function()
    {
        if (!hasAAVideoFocus())
        {
            showOperaSurface_orig();
        }
    }

    framework._showTemplateSurfaces = function(someTemplate)
    {
        if (!hasAAVideoFocus())
        {
            showTemplateSurfaces_orig(someTemplate);
        }
    }

    framework._hideTemplateSurfaces = function(someTemplate)
    {
        if (!hasAAVideoFocus())
        {
            return hideTemplateSurfaces_orig(someTemplate);
        }
        return false;
    }

    this.hookInstalled = true;
}

AAInstallHook();