
const request = (host, url, complete, always, failed) => {
    const path = host + "/" + url;
    fetch(path, {
        method: 'GET',
        cache: 'no-cache',
    })
        .then(response => {
            if (always) always();
            response.json().then(json => {
                if (response.ok) {
                    complete(json);
                } else {
                    if (failed) failed({
                        error: `server error ${response.status} calling ${path}`,
                        status: response.status,
                        body: json,
                    })
                }
            });
        })
        .catch(error => {
            if (always) always();
            if (failed) failed({
                error: `failed to fetch from ${path}`
            });
        });
}

export default request;
