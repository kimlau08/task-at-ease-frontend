import cleaningImg from '../assets/cleaning.jpg';
import movingImg from '../assets/moving.jpg';
import deliveryImg from '../assets/delivery.jpg';
import carpentryImg from '../assets/carpentry.jpg';
import paintingImg from '../assets/painting.jpg';
import installingImg from '../assets/installing.jpg';
import packingImg from '../assets/packing.jpg';
import sanitizingImg from '../assets/sanitizing.jpg';
import restoringImg from '../assets/restoring.jpg';

let SampleTasks = [];


SampleTasks.push( {
    img: cleaningImg,
    desc: 'Cleaning',
    cost: '$50 to $90'
});

SampleTasks.push( {
    img: movingImg,
    desc: 'Moving',
    cost: '$50 to $100'
});

SampleTasks.push( {
    img: carpentryImg,
    desc: 'Carpentry',
    cost: '$50 to $200'
});

SampleTasks.push( {
    img: deliveryImg,
    desc: 'Delivery',
    cost: '$20 to $50'
});

SampleTasks.push( {
    img: sanitizingImg,
    desc: 'Sanitizing',
    cost: '$50 to $100'
});

SampleTasks.push( {
    img: paintingImg,
    desc: 'Painting',
    cost: '$50 to $100'
});

SampleTasks.push( {
    img: installingImg,
    desc: 'Install appliances',
    cost: '$50 to $150'
});

SampleTasks.push( {
    img: packingImg,
    desc: 'Packing',
    cost: '$50 to $100'
});

SampleTasks.push( {
    img: restoringImg,
    desc: 'Restoring',
    cost: '$100 to $300'
});

export default SampleTasks;