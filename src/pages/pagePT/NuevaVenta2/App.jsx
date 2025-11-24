import { Button } from 'primereact/button';
import { Stepper } from 'primereact/stepper';
import { StepperPanel } from 'primereact/stepperpanel';
import React, { useRef } from 'react'
import { DatosCliente } from './DatosCliente/DatosCliente';

export const App = () => {
        const stepperRef = useRef(null);
  return (
    <div className="card flex justify-content-center">
        <Stepper ref={stepperRef} style={{ flexBasis: '50rem' }} linear>
            <StepperPanel header="Datos del cliente">
                <div className="flex flex-column">
                        <DatosCliente/>
                </div>
                <div className="flex pt-4 justify-content-end">
                    <Button label="Next" icon="pi pi-arrow-right" iconPos="right" onClick={() => stepperRef.current.nextCallback()} />
                </div>
            </StepperPanel>
            <StepperPanel header="Productos y membresia">
                <div className="flex flex-column h-12rem">
                    <div className="border-2 border-dashed surface-border border-round surface-ground flex-auto flex justify-content-center align-items-center font-medium">Content II</div>
                </div>
                <div className="flex pt-4 justify-content-between">
                    <Button label="Back" severity="secondary" icon="pi pi-arrow-left" onClick={() => stepperRef.current.prevCallback()} />
                    <Button label="Next" icon="pi pi-arrow-right" iconPos="right" onClick={() => stepperRef.current.nextCallback()} />
                </div>
            </StepperPanel>
            <StepperPanel header="Pagos">
                <div className="flex flex-column h-12rem">
                    <div className="border-2 border-dashed surface-border border-round surface-ground flex-auto flex justify-content-center align-items-center font-medium">Content III</div>
                </div>
                <div className="flex pt-4 justify-content-start">
                    <Button label="Back" severity="secondary" icon="pi pi-arrow-left" onClick={() => stepperRef.current.prevCallback()} />
                </div>
            </StepperPanel>
            <StepperPanel header="Invoice">
                <div className="flex flex-column h-12rem">
                    <div className="border-2 border-dashed surface-border border-round surface-ground flex-auto flex justify-content-center align-items-center font-medium">Content III</div>
                </div>
                <div className="flex pt-4 justify-content-start">
                    <Button label="Back" severity="secondary" icon="pi pi-arrow-left" onClick={() => stepperRef.current.prevCallback()} />
                </div>
            </StepperPanel>
        </Stepper>
    </div>
  )
}
