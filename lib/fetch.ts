export async function getData(apiKey: string, endpoint: string) {
    try {
        const response = await fetch(endpoint, {
            method: 'GET',
            headers: {
                'Authorization': `${apiKey}`
            }
        });

        if (!response.ok) {
            throw new Error(`Request failed with status: ${response.statusText}`);
        }

        let data;
        if (response.headers.get("content-type")?.includes("application/json")) {
            data = await response.json();
        }
        return data;

    } catch (error) {
        console.error('Error in getData:', error);
        throw error;
    }
}



export async function postData(apiKey: string, endpoint: string, payload?: any) {
    const options: RequestInit = {
        method: 'POST',
        headers: {
          'Authorization': `${apiKey}`,
          'Content-Type' : 'application/json'
        }
    }
    if (payload) {
        options.body = JSON.stringify(payload);
    }
    
    try {
        const response = await fetch(endpoint, options);
        if (!response.ok) {
            throw new Error(`Request failed with status: ${response.statusText}`);
        }
        const data = await response.json();
        return data;

    } catch (error) {
        console.error('Error in postData:', error);
        throw error; 
    }
}

export async function deleteData(apiKey: string, endpoint: string) {
    try {
        const response = await fetch(endpoint, {
            method: 'DELETE',
            headers: {
                'Authorization': `${apiKey}`
            }
        });

        if (!response.ok) {
            throw new Error(`Request failed with status: ${response.statusText}`);
        }

        let data;
        if (response.headers.get("content-type")?.includes("application/json")) {
            data = await response.json();
        }
        return data;

    } catch (error) {
        console.error('Error in deleteData:', error);
        throw error;
    }
}

export async function updateData(apiKey: string, endpoint: string, payload?: any) {
    try {
        const response = await fetch(endpoint, {
            method: 'PUT',
            headers: {
                'Authorization': `${apiKey}`
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            throw new Error(`Request failed with status: ${response.statusText}`);
        }

        let data;
        if (response.headers.get("content-type")?.includes("application/json")) {
            data = await response.json();
        }
        return data;

    } catch (error) {
        console.error('Error in updateData:', error);
        throw error;
    }
}

