package com.fast0n.ipersonalarea;

import android.content.Intent;
import android.content.pm.ActivityInfo;
import android.os.Bundle;
import android.support.v7.app.ActionBar;
import android.support.v7.app.AppCompatActivity;
import android.support.v7.widget.CardView;
import android.support.v7.widget.Toolbar;
import android.util.Base64;
import android.view.MenuItem;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.ProgressBar;
import android.widget.TextView;
import android.widget.Toast;

import com.android.volley.Request;
import com.android.volley.RequestQueue;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.JsonObjectRequest;
import com.android.volley.toolbox.Volley;
import com.github.ybq.android.spinkit.style.CubeGrid;

import org.json.JSONException;
import org.json.JSONObject;

import java.util.Objects;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import es.dmoral.toasty.Toasty;

public class ChangeEmailActivity extends AppCompatActivity {

    EditText edt_email, edt_password;
    Button btn_change_email;
    ActionBar actionBar;
    ProgressBar loading;
    CardView cardView;

    public static boolean isEmail(String email) {
        String expression = "^[\\w\\.]+@([\\w]+\\.)+[A-Z]{2,7}$";
        CharSequence inputString = email;
        Pattern pattern = Pattern.compile(expression, Pattern.CASE_INSENSITIVE);
        Matcher matcher = pattern.matcher(inputString);
        return matcher.matches();
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_change_email);
        Toolbar toolbar = findViewById(R.id.toolbar);
        setSupportActionBar(toolbar);
        setRequestedOrientation(ActivityInfo.SCREEN_ORIENTATION_SENSOR_PORTRAIT);
        TextView mTitle = toolbar.findViewById(R.id.toolbar_title);
        mTitle.setText(R.string.change_email_title);
        Objects.requireNonNull(getSupportActionBar()).setDisplayShowTitleEnabled(false);

        // set row icon in the toolbar
        actionBar = getSupportActionBar();
        actionBar.setHomeButtonEnabled(true);
        actionBar.setDisplayHomeAsUpEnabled(true);
        actionBar.setDisplayShowHomeEnabled(true);

        final Bundle extras = getIntent().getExtras();
        assert extras != null;
        final String password = extras.getString("password");
        final String token = extras.getString("token");
        final String site_url = getString(R.string.site_url);

        // java adresses
        cardView = findViewById(R.id.cardView);
        edt_email = findViewById(R.id.edt_email);
        edt_password = findViewById(R.id.edt_password);
        btn_change_email = findViewById(R.id.btn_change_email);
        loading = findViewById(R.id.progressBar);
        CubeGrid cubeGrid = new CubeGrid();
        loading.setIndeterminateDrawable(cubeGrid);
        cubeGrid.setColor(getResources().getColor(R.color.colorPrimary));

        btn_change_email.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {

                byte[] decodeValue1 = Base64.decode(password, Base64.DEFAULT);
                String ppassword = new String(decodeValue1);


                if (edt_password.getText().toString().equals(ppassword.replace("\n", "").replace("    ", ""))
                        && edt_password.getText().toString().length() != 0
                        && edt_email.getText().toString().length() != 0) {
                    if (isEmail(edt_email.getText().toString())) {
                        String url = site_url + "?email=" + edt_email.getText().toString() + "&email_confirm="
                                + edt_email.getText().toString() + "&password=" + password.replaceAll("\\s+", "") + "&token=" + token;

                        loading.setVisibility(View.VISIBLE);
                        cardView.setVisibility(View.INVISIBLE);
                        changeMail(url);


                        btn_change_email.setEnabled(false);
                    } else {


                        edt_password.setInputType(0);
                        btn_change_email.setEnabled(true);
                        Toasty.warning(ChangeEmailActivity.this, getString(R.string.email_wrong), Toast.LENGTH_LONG,
                                true).show();
                    }
                } else
                    Toasty.warning(ChangeEmailActivity.this, getString(R.string.wrong_password), Toast.LENGTH_LONG,
                            true).show();

            }
        });

    }

    private void changeMail(String url) {

        RequestQueue queue = Volley.newRequestQueue(ChangeEmailActivity.this);

        JsonObjectRequest getRequest = new JsonObjectRequest(Request.Method.GET, url, null,
                new Response.Listener<JSONObject>() {

                    @Override
                    public void onResponse(JSONObject response) {
                        try {

                            JSONObject json_raw = new JSONObject(response.toString());
                            String iliad = json_raw.getString("iliad");

                            JSONObject json = new JSONObject(iliad);
                            String string_response = json.getString("0");

                            if (string_response.equals("true")) {

                                edt_password.setInputType(0);
                                Intent intent = new Intent(ChangeEmailActivity.this, LoginActivity.class);
                                startActivity(intent);

                                Toasty.success(ChangeEmailActivity.this, getString(R.string.email_change_success),
                                        Toast.LENGTH_LONG, true).show();
                            }

                        } catch (JSONException ignored) {
                        }

                    }
                }, new Response.ErrorListener() {
            @Override
            public void onErrorResponse(VolleyError error) {

            }
        });

        queue.add(getRequest);

    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {

        switch (item.getItemId()) {
            case android.R.id.home:

                super.onBackPressed();

                return true;
            default:
                return super.onOptionsItemSelected(item);
        }
    }
}
