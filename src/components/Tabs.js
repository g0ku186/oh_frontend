const Tabs = ({ tabs, selectedTab, handleTabChange }) => {
    function classNames(...classes) {
        return classes.filter(Boolean).join(' ')
    }

    const handleSelectChange = (event) => {
        handleTabChange(event.target.value);
    }

    return (
        <div className="mb-8 text-gray-800">
            <div className="sm:hidden">
                <label htmlFor="tabs" className="sr-only">
                    Select a tab
                </label>
                {/* Use an "onChange" listener to redirect the user to the selected tab URL. */}
                <select
                    id="tabs"
                    name="tabs"
                    className="block w-full rounded-md border-gray-300 focus:primary focus:ring-primary"
                    defaultValue={selectedTab}
                    onChange={handleSelectChange}
                >
                    {tabs.map((tab) => (
                        <option key={tab.name} value={tab.name}>{tab.name}</option>
                    ))}
                </select>
            </div>
            <div className="hidden sm:block">
                <div className="border-b border-gray-200">
                    <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                        {tabs.map((tab) => (
                            <div
                                key={tab.name}
                                onClick={() => handleTabChange(tab.name)}
                                className={classNames(
                                    tab.name === selectedTab
                                        ? 'border-primaryDark text-white font-semibold'
                                        : 'border-transparent text-gray-300 hover:border-primary hover:text-white',
                                    'group inline-flex items-center border-b-2 py-4 px-1 text-sm font-medium cursor-pointer'
                                )}
                            >
                                <tab.icon
                                    className={classNames(
                                        tab.name === selectedTab ? 'text-primaryDark' : 'text-gray-300 group-hover:text-primary',
                                        '-ml-0.5 mr-2 h-5 w-5'
                                    )}
                                    aria-hidden="true"
                                />
                                <span>{tab.name}</span>
                            </div>
                        ))}
                    </nav>
                </div>
            </div>
        </div>
    )
}

export default Tabs
