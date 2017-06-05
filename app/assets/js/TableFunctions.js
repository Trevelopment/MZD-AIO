function getTable(a)
{var c=a.parentNode;while(c.tagName!='TABLE')
{c=c.parentNode;}
return c;}
function getRow(a)
{var c=a.parentNode;while(c.tagName!='TR')
{c=c.parentNode;}
return c;}
function getCell(a)
{var c=a.parentNode;while(c.tagName!='TD')
{c=c.parentNode;}
return c;}
function getRowIndex(a)
{var c=a.parentNode;while(c.tagName!='TR')
{c=c.parentNode;}
return c.rowIndex;}
function addRow(tbl,i,NumCells)
{var r=tbl.insertRow(i);for(j=0;j<NumCells;j++)
{var c=r.insertCell(j);c.innerHTML="";}}