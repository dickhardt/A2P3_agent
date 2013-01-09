/* 
* Copyright (C) Province of British Columbia, 2013
*/
function GUID ()
{
    var S4 = function ()
    {
        return Math.floor(
                Math.random() * 0x10000 /* 65536 */
            ).toString(16);
    };

    return (
            S4() + S4() + "-" +
            S4() + "-" +
            S4() + "-" +
            S4() + "-" +
            S4() + S4() + S4()
        );
}

function rtrim(str, ch)
{
    for (i = 0; i < str.length; i++)
    {
        if (ch == str.charAt(i))
        {
            str = str.substring(0, i);
            break;
        }
    } 
    return str;
}

