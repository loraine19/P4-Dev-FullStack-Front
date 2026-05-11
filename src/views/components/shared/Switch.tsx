/* SWITCH TAB */
interface ITab {
  id: string;
  label: string;
}

/* SWITCH PROPS */
interface ISwitchProps {
  activeTab: string;
  tabs: ITab[];
  onTabChange: (tabId: string) => void;
}

/* SWITCH */
const Switch = ({ activeTab, tabs, onTabChange }: ISwitchProps) => {
  return (
    <div className="switch-tabs">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          className={`switch-tab ${activeTab === tab.id ? 'is-active' : ''}`}
          onClick={() => onTabChange(tab.id)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};

export default Switch;
