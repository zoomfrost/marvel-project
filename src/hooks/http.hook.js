import {useState, useCallback} from 'react';

export const useHttp = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [process, setProcess] = useState('waiting');

    const request = useCallback( async(url, method = 'GET', body = null, headers = {'Content-Type': 'application/json'}) => {

        setLoading(true);
        setProcess('loading');
        try {
            const responce = await fetch(url, {method, body, headers});

            if (!responce.ok) {
                throw new Error(`Could not fetch ${url}, status: ${responce.status}`);
            }

            const data = await responce.json();

            setLoading(false);
            return data;
        } catch(e) {
            setLoading(false);
            setError(e.message);
            setProcess('error');
            throw e;
        }

    }, []);

    const clearError = useCallback(() => {
        setError(null);
        setProcess('loading');
    }, []);

    return {loading, request, error, clearError, process, setProcess};
}