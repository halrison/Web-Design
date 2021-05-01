jQuery(document).ready(
	() => {
		jQuery('form').submit(
			event => {
				event.preventDefault(); 
				if (jQuery('#Username').val() == 'admin' && jQuery('#Password').val() == '1234') {
					sessionStorage.setItem('role', 'admin');
					location.assign('admin.html');
				}
			}
		);
	}
);