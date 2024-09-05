import { FileUploader } from '@/components';
import { TabPanel, TabView } from 'primereact/tabview';
import React from 'react'
import { Col, Row } from 'react-bootstrap'
import { useDropzone } from 'react-dropzone';

export const ScreenNutricionista = () => {
    const {getRootProps, getInputProps, acceptedFiles} = useDropzone({noDrag: true});
    const files = acceptedFiles.map(file => <li key={file.path}>{file.path}</li>);
  return (
    <>
        <TabView>
            <TabPanel header='Planes de alimentacion'>

            </TabPanel>
            <TabPanel header='Historial clinico'>
                
            </TabPanel>
        </TabView>
        <Row>
            <Col xxl={12}>
                <form>
                    
							<FileUploader />
                </form>
            </Col>
            <Col xxl={12}>
            </Col>
        </Row>
    </>
  )
}
