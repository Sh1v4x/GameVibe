import React, { useEffect, useRef } from "react";
import { observer } from "mobx-react";

const Account = observer(
  ({ userStore, language, languageContext, setLanguageContext }) => {
    const [isLoading, setIsLoading] = React.useState(true);
    const inputRef = useRef(null);

    useEffect(() => {
      userStore.updateUser().then(() => {
        setIsLoading(false);
      });
    }, [userStore]);

    if (isLoading) {
      return <div className="loading">Chargement...</div>;
    }

    if (!userStore.username) {
      return <div></div>;
    }

    const handleUsernameChange = () => {
      userStore.updateUsername(inputRef.current.value);
    };

    const handleInputKeyPress = (e) => {
      if (e.key === "Enter") {
        handleUsernameChange();
      }
    };

    const handleInputBlur = () => {
      handleUsernameChange();
    };

    return (
      <div className="account-container">
        <div className="account-header">
          <h1 className="account-title">{languageContext.profile_overview}</h1>
        </div>
        <div className="account-content">
          <div className="account-info">
            <div className="account-info-content">
              <div className="account-info-content-item">
                <h3>Username :</h3>
                <input
                  type="text"
                  defaultValue={userStore.username}
                  className="formatted-input"
                  ref={inputRef}
                  onKeyUp={handleInputKeyPress}
                  onBlur={handleInputBlur}
                />
              </div>
              <div className="account-info-content-item">
                <h3>Email :</h3>
                <p className="formatted-text">{userStore.email}</p>
              </div>
              <div className="account-info-content-item">
                <label htmlFor="language-select">Language :</label>
                <select
                  id="language-select"
                  onChange={(e) => {
                    userStore.updateLanguage(e.target.value).then(() => {
                      setLanguageContext(e.target.value);
                    });
                  }}
                  defaultValue={language}
                >
                  <option value="en">{languageContext.english}</option>
                  <option value="fr">{languageContext.french}</option>
                </select>
              </div>
              <div className="account-info-content-item">
                <button
                  onClick={() => {
                    userStore.deleteAccount();
                  }}
                  className="delete-account"
                >
                  {languageContext.delete_account}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
);

export default Account;
