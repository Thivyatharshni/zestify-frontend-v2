import { useLocation as useLocationContext } from '../context/LocationContext';

export const useLocation = () => {
    return useLocationContext();
};
