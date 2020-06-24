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
    id: 0,
    img: cleaningImg,
    desc: 'Cleaning',
    cost: '$50 to $90'
});

SampleTasks.push( {
    id: 1,
    img: movingImg,
    desc: 'Moving',
    cost: '$50 to $100'
});

SampleTasks.push( {
    id: 2,
    img: carpentryImg,
    desc: 'Carpentry',
    cost: '$50 to $200'
});

SampleTasks.push( {
    id: 3,
    img: deliveryImg,
    desc: 'Delivery',
    cost: '$20 to $50'
});

SampleTasks.push( {
    id: 4,
    img: sanitizingImg,
    desc: 'Sanitizing',
    cost: '$50 to $100'
});

SampleTasks.push( {
    id: 5,
    img: paintingImg,
    desc: 'Painting',
    cost: '$50 to $100'
});

SampleTasks.push( {
    id: 6,
    img: installingImg,
    desc: 'Install appliances',
    cost: '$50 to $150'
});

SampleTasks.push( {
    id: 7,
    img: packingImg,
    desc: 'Packing',
    cost: '$50 to $100'
});

SampleTasks.push( {
    id: 8,
    img: restoringImg,
    desc: 'Restoring',
    cost: '$100 to $300'
});

export default SampleTasks;