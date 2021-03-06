import React from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import LocalCard from '../StudentComponents/UI/resourceCard/resourceCard';
import classes from './resources.module.css';

const resourcesPage = (props)=>{
    //cardsInfo = [{title:"...", description:"...", file:"..."},{...}]
    let cardsInfoCol1 = [];
    let cardsInfoCol2 = [];
    let cardsInfoCol3 = [];

    let getFile = (id)=>{
        props.getResourceFile(id);
    }

    for(let i=0; i<props.cardsInfo.length; i++ ){

        if(cardsInfoCol1.length < 3)
        {
            cardsInfoCol1.push(props.cardsInfo[i]);
        }
        else if(cardsInfoCol2.length<3)
        {
            cardsInfoCol2.push(props.cardsInfo[i]);
        }
        else
        {
            cardsInfoCol3.push(props.cardsInfo[i]);
        }
    }
    for(let i in cardsInfoCol1)
    {
        console.log("cardsInfoCol1["+i+"] = ",cardsInfoCol1[i]);
    }
    return(
        <>
        <Row>
            {cardsInfoCol1.map( (cardInfo,index) =>(
                <LocalCard 
                key={index}
                className={classes.LocalCard} 
                title={cardInfo.name} 
                description={cardInfo.description}
                resourceId={cardInfo.id}/> ))   }
        </Row>

        <Row>   
            {cardsInfoCol2.map( (cardInfo,index) =>(
                    <LocalCard 
                    key={index}
                    className={classes.LocalCard} 
                    title={cardInfo.name} 
                    description={cardInfo.description}
                    downloadLink={cardInfo.file}
                    resourceId={cardInfo.id}/> ))   }
        </Row>
        <Row>
            {cardsInfoCol3.map( (cardInfo,index) =>(
                <LocalCard 
                key={index}
                className={classes.LocalCard} 
                title={cardInfo.name} 
                description={cardInfo.description}
                downloadLink={cardInfo.file}
                pageType={props.pageType}
                resourceId={cardInfo.id}/> ))   }
        </Row>
        </>);
}

export default resourcesPage;
