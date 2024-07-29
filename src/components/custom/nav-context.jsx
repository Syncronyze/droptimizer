const { createContext, useState, default: React } = require('react');

export const NavContext = createContext(null);

export function NavContextProvider({ children }) {
    const [navState, setNavState] = useState({
        selectedInstance: null,
        selectedDifficulty: null,
        selectedEncounter: null,
    });

    const updateNavState = (state) => {
        setNavState({ ...navState, ...state });
    };

    return (
        <NavContext.Provider value={{ navState, updateNavState }}>{children}</NavContext.Provider>
    );
}
