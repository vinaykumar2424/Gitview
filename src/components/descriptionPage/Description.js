import React, { useEffect, useState } from 'react';
import './Description.css';
import axios from 'axios';
import sanitizeHtml from 'sanitize-html';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import gear from '../images/gear.png'
import { useLocation, useNavigate } from 'react-router-dom';
const Description = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const repoData = location?.state?.repoData;
    const [fileContents, setFileContents] = useState({});
    const [documentation, setDocumentation] = useState('');
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        if (repoData) {
            fetchRepoContents(repoData.owner.login, repoData.name);
        }
    }, [repoData]);
    const fetchRepoContents = async (owner, repo, path = '') => {
        try {
            const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${path}`);
            const data = await response.json();
            const dataObj = {};
            const filesToFetch = data?.filter(item => item.type === 'file' && /\.(js|ts|jsx|tsx|html|py|php|cpp|java|rb|cs|pl|sql|json|yml|ipynb)$/.test(item.name));
            // const filesToFetch = data.filter(item => {
            //     // Exclude image files with extensions png, jpg, and jpeg
            //     const isImage = /\.(png|jpg|jpeg|ico|gif|svg|md|gitignore|firebaserc)$/.test(item.name);
            //     return item.type === 'file' && !isImage;
            // });

            let directories = data?.filter(item => item.type === 'dir');
            while (directories.length > 0) {
                const directory = directories.shift();
                const directoryResponse = await fetch(directory.url);
                const directoryData = await directoryResponse.json();
                filesToFetch.push(...directoryData?.filter(item => item.type === 'file' && /\.(js|ts|jsx)$/.test(item.name)));
                directories.push(...directoryData?.filter(item => item.type === 'dir'));
            }

            await Promise.all(filesToFetch.map(async file => {
                const fileResponse = await fetch(file.download_url);
                const code = await fileResponse.text();
                dataObj[file.name] = code;
                return file.name;
            }));
            setFileContents(dataObj);
        } catch (error) {
            console.error('Error:', error);
            setError(error)
        }
    };

    console.log(error?.response?.status)



    const generateCompletion = async (prompt) => {
        try {
            // const promptData = await prompt.replace(/\n/g, '');
            const sanitizedPrompt = sanitizeHtml(prompt.replace(/\n/g, ''));
            console.log(sanitizedPrompt)
            if (sanitizedPrompt && Object.keys(fileContents).length > 0) {
                setLoading(true)
                console.log(fileContents)
                const response = await axios.post('http://localhost:5000/doc', {
                    prompt: sanitizedPrompt
                });
                console.log('Received response from server:', response);
                const res = response.data.text;
                setDocumentation(res)
                setLoading(false)
            }

        } catch (error) {
            console.error('Error:', error);
            setError(error)
        }
    };

    useEffect(() => {
        if (Object.keys(fileContents).length > 0 && !error) {
            console.log(fileContents)
            const generatePrompt = () => {
                const additionalText = `Here's the code for my project. Could you help me create comprehensive documentation in Readme.md for upload on github?Please add the component tree also and give the components details in a good way with good amount of text so everyone can undersatand easily. Take this as an example

                # Widget Management Application Documentation

## Introduction

The Widget Management Application is a web-based tool designed to manage and visualize data using customizable widgets. Users can add, customize, and delete widgets to create personalized dashboards for data analysis. The application is built using React.js and utilizes various packages for UI components and data visualization.

## Features

1. **Widget Management**: Users can add, customize, and delete widgets to create personalized dashboards.
2. **Customization Options**: Each widget can be customized with different colors and styles to represent data effectively.
3. **Data Visualization**: The application provides various types of charts and components for data visualization, including line charts, pie charts, and bar graphs.
4. **User-Friendly Interface**: The interface is designed to be intuitive, allowing users to easily navigate, add, and manage widgets.

## Note

1. **Work in progress** - Have to work on mobile view interface.
2. **To adjest the model screen** while adding widgets, you can double click on that widget and loose grip then you can move your cursor then screen will move.
3. **Widget screen is responsive**, you can move the position of widgets by drag and drop. 


## Components

### 1. Sidebar and Navigation

- **Description**: The sidebar and navigation bar provide access to different sections of the application, including adding new widgets and managing existing ones. (For now it doesn't contains the functionality. Just to show.)
- **Functionality**: Users can navigate between different sections and access widget management features.

### 2. Widgets

- **Description**: Widgets are components that display data in various formats, such as charts, graphs, and text blocks.
- **Functionality**: Users can add, customize, and delete widgets to visualize different data sets.

### 3. Model Component

- **Description**: The Model component is a modal dialog that appears when users want to add a new widget.
- **Functionality**: Users can select the type of widget (e.g., line chart, pie chart) and customize its appearance (e.g., colors, labels) before adding it to the dashboard.

### 4. Delete Button

- **Description**: Each widget includes a delete button for removing the widget from the dashboard.
- **Functionality**: Clicking the delete button removes the corresponding widget from the dashboard.

## Packages Used

- **apexcharts**: Interactive JavaScript charts library
- **react-apexcharts**: React wrapper for ApexCharts
- **draggabilly**: JavaScript library for draggable UI elements
- **react-draggable**: React component for draggable elements
- **packery**: JavaScript layout library for draggable grid layouts
- **react-flow-renderer**: React component for rendering flowcharts and diagrams
- **react-zoom-pan-pinch**: React component for zooming, panning, and pinching images and elements
  
## Json Data

- Color coding data is coming from JsonData.json file

## Usage

To use the Widget Management Application, follow these steps:

1. Navigate to the homepage of the application.
2. To add a new widget, click on the "Add Widget" button in the navigation bar.
3. Customize the widget using the Model component, selecting the type and appearance.
4. Click "Save" to add the widget to the dashboard.
5. To delete a widget, use the delete button located on each widget.

## Component Structure

![App Tree](./src/components/images/appTree.png)

## Conclusion

The Widget Management Application provides a user-friendly interface for managing and visualizing data through customizable widgets. With its intuitive design and rich features, users can create dynamic dashboards for data analysis and decision-making. 



                make it like this.`;
                const prompt = JSON.stringify(fileContents) + ' ' + additionalText;
                return prompt;
            };
            const prompt = generatePrompt();
            generateCompletion(prompt);
        }
    }, [fileContents]);

    function breakLinesAfterSymbol(inputString, symbol) {
        const splitString = inputString.split(symbol);
        const result = splitString.join('\n').replace(new RegExp(symbol, 'g'), '');
        return result;
    }
    const result = breakLinesAfterSymbol(documentation, "<br>");

    //handle functions

    const handleCopy = (e) => {
        console.log('copied');
        if (window.navigator?.clipboard) {
            window.navigator.clipboard.writeText(result)
                .then(() => console.log('Text copied to clipboard'))
                .catch(err => console.error('Error copying text to clipboard:', err));
        } else {
            console.error('Clipboard API not available');
        }
    };

    const handleDownload = () => {
        const markdownBlob = new Blob([result], { type: 'text/markdown' });
        const url = URL.createObjectURL(markdownBlob);

        const a = document.createElement('a');
        a.href = url;
        a.download = 'Readme.md';
        document.body.appendChild(a);
        a.click();

        // Clean up
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        console.log('donwloaded')
    };

    const handleHide = () => {
        const errorBox = document.getElementsByClassName('error-box');
        if (errorBox && errorBox.length > 0) {
            errorBox[0].style.display = 'none';
        }
    }
    useEffect(() => {
        setTimeout(() => handleHide(), 10000)
    }, [])

    return (
        <div id='documentation'>
            {!error && <div className='heading-one'>
                {loading && !result && <img src={gear} alt="gear" />}
                <h1>{loading && !result ? `Generating documentation for Repository ${repoData.name}` : `Congratulations🎉`}</h1>
            </div>}
            <button className='back-btn' onClick={() => navigate(-1)}>
                <span>&#171;</span>
                <span>Back</span>
            </button>
            <h2 className='heading-two'>{!loading && `Thank you for choosing us.`}</h2>
            <div className='code-editor'>
                <span className='option-bar'>
                    <span>
                        <span className="material-symbols-outlined">
                            bookmark
                        </span>
                        <span>Readme.md</span>
                    </span>
                    <div>
                        <span className='refresh-btn' >
                            <span className="material-symbols-outlined">
                                refresh
                            </span>
                        </span>
                        <span className='download-btn' onClick={handleDownload}>
                            <span className="material-symbols-outlined">
                                file_download
                            </span>
                        </span>
                        <span className='copy-btn' onClick={(e) => handleCopy(e)}>
                            <span className="material-symbols-outlined">
                                content_copy
                            </span>
                            <span>Copy code</span>
                        </span>
                    </div>
                </span>
                <SyntaxHighlighter language="markdown" style={atomDark} className={error && `SyntaxHighlighter`}  >
                    {result}
                </SyntaxHighlighter>
            </div>
            {error && <div className='error-box'>
                <span></span>
                <span>
                    <span>Default Notification</span>
                    {error && error?.response?.status !== (413 || 404) && <span>We are facing some Issue, Please try after some time</span>}
                    {error?.response?.status === 413 && <span>Files size too large, Please reduce it for better documentation</span>}
                    {error?.response?.status === 404 && <span>Empty repository, Please check the repository in github</span>}
                </span>
                <span className='material-symbols-outlined' onClick={handleHide}>close</span>
            </div>}
        </div>
    );
};

export default Description;
