import { Alchemy, Network, Utils } from 'alchemy-sdk';
import { useEffect, useState } from 'react';
import './App.css';

// Refer to the README doc for more information about using API
// keys in client-side code. You should never do this in production
// level code.
const settings = {
  apiKey: process.env.REACT_APP_ALCHEMY_API_KEY,
  network: Network.ETH_MAINNET,
};

// In this week's lessons we used ethers.js. Here we are using the
// Alchemy SDK is an umbrella library with several different packages.
//
// You can read more about the packages here:
//   https://docs.alchemy.com/reference/alchemy-sdk-api-surface-overview#api-surface
const alchemy = new Alchemy(settings);

const App = () => {
  const [blockNumber, setBlockNumber] = useState();
  const [block, setBlock] = useState();
  const [showTransList, setShowTransList] = useState(false);
  const [expandTransaction, setExpandTransaction] = useState(false);
  const [transactionData, setTransactionData] = useState({});

  useEffect(() => {
    const getBlockNumber = async () => {
      setBlockNumber(await alchemy.core.getBlockNumber());
    }
    getBlockNumber();
  }, []);

  useEffect(() => {
    const getBlock = async () => {
      setBlock(await alchemy.core.getBlock(blockNumber));
    }
    getBlock();
  }, [blockNumber]);

  const getTransactionDetails = async (transactionHash, index) => {
    setExpandTransaction(expandTransaction === index ? null : index);
    
    const receipt = await alchemy.core.getTransactionReceipt(transactionHash);

    setTransactionData((prevData) => ({
      ...prevData,
      [index]: receipt,
    }));
  };

  return (
    <div className="App">
      <div className="blockHeader">
        Current Block Number: {blockNumber}
      </div>
      <div className="blockTitle">
        Status of Block #{blockNumber} <span>({block?.hash})</span>
      </div>
      <div>
        {block && (
        <div className="tableContainer">
          <table className="blockStatus">
            <tbody>
              <tr>
                <td>
                  Base Fee Per Gas
                </td>
                <td>
                  {Utils.formatEther(block?.baseFeePerGas._hex)} ETH
                  ({Utils.formatUnits(block?.baseFeePerGas._hex, "wei")} WEI)
                </td>
              </tr>
              <tr>
                <td>
                  Gas Limit
                </td>
                <td>
                  {Utils.formatEther(block?.gasLimit)} ETH
                  ({Utils.formatUnits(block?.gasLimit, "wei")} WEI)
                </td>
              </tr>
              <tr>
                <td>
                  Gas Used
                </td>
                <td>
                  {Utils.formatEther(block?.gasUsed)} ETH
                  ({Utils.formatUnits(block?.gasUsed, "wei")} WEI)
                </td>
              </tr>
              <tr>
                <td>
                  Time Created
                </td>
                <td>
                  {block?.timestamp && Date(block.timestamp)}
                </td>
              </tr>
              <tr>
                <td>
                  Total transactions
                </td>
                <td>
                  {block?.transactions.length} <button className="showTransactionButton" onClick={() => setShowTransList(true)}>see transaction list</button>
                </td>
              </tr>
          </tbody>
          </table>
        </div>
        )}
        {showTransList && (
        <div className="transactionContainer">
          <div className="transactionHeader">
            Transaction List
          </div>
          <div className="transactionListContainer">
            {block?.transactions.map((trans, index) => {
              return (
                <div className="transactionList" key={index}>
                  <button className="transactionButton" onClick={() => getTransactionDetails(trans, index)}>
                    {trans}
                  </button>
                  {expandTransaction === index ? 
                    (transactionData[index] ? (
                      <table className="transactionDetails">
                        <thead>
                          <tr>
                            <td>
                              From
                            </td>
                            <td>
                              To
                            </td>
                            <td>
                              Gas Used
                            </td>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>
                              {transactionData[index]?.from}
                            </td>
                            <td>
                              {transactionData[index]?.to}
                            </td>
                            <td>
                              {transactionData[index] && Utils.formatEther(transactionData[index]?.gasUsed._hex)} ETH
                            </td>
                          </tr>
                        </tbody>
                        
                      </table>
                    ) : (<div className="loader">LOADING DATA...</div>))
                  : null
                  }
                  <hr style={{
                    border: "0",
                    borderTop: "1px solid",
                    color: 'lightgrey',
                    margin: '12px 0'
                  }} />
                </div>
              );
            })
            }
          </div>
        </div>
        )}
      </div>
    </div>
  );
}

export default App;
